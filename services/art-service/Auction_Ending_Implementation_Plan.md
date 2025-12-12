# Implementation Plan - Auction Ending & Winner Announcement

## Goal Description
Automate the process of ending auctions when their `endTime` is reached. This includes identifying expired auctions, determining the winner (highest bidder), settling the financial transaction (moving locked funds to the seller), and updating the auction status.

## User Review Required
> [!IMPORTANT]
> **Wallet Service Change**: We need to add a specific `settleAuction` (or `captureFunds`) endpoint in the `wallet-service`. The existing `processPurchase` might not handle "locked" funds correctly (it checks current balance, but funds are already locked). We assume `lockFunds` reserves the amount. The settlement must deduct from the *locked* balance and credit the seller.

> [!NOTE]
> **Scheduler**: We will use **RabbitMQ Delayed Messages** (TTL + DLX) to handle auction endings event-drivenly. This avoids polling.

## Proposed Changes

### Locking Mechanism (Immediate Unlock)
> [!IMPORTANT]
> **Constraint**: At any point, **only the current highest bidder** should have funds locked.
> **Logic**:
> 1. When `User A` bids 100: Lock 100.
> 2. When `User B` bids 120: 
>    - Lock 120 from User B.
>    - **Immediately** unlock 100 for User A.
> 3. This ensures strict "highest bid only" locking.
> 
> **Note**: The existing `PlaceBidUseCase` has this logic. We will verify and test this flow specifically to ensure `User A` is unlocked.

### Wallet Service
#### [NEW] `src/application/usecases/wallet/SettleAuctionUseCase.ts`
- Implement logic to transfer `amount` from `buyer` (locked funds) to `seller` (balance).
- **Validation**: Ensure `buyer.lockedAmount >= amount`.
- **Action**: 
    - `buyer.lockedAmount -= amount`
    - `seller.balance += amount` (and update stats)
    - Record Transaction: `TRANSFER` type.

#### [MODIFY] `src/presentation/controllers/WalletController.ts`
- Add `settleAuction` method.

#### [MODIFY] `src/presentation/routes/wallet.routes.ts`
- Add `POST /settle` route.

### Art Service
#### [MODIFY] `src/infrastructure/messaging/rabbitmq.ts` (or create new `RabbitMQService.ts`)
- **Queue Architecture (Delayed Jobs)**:
    - **Goal**: Trigger `auction.end` event at `endTime`.
    - **Pattern**: **TTL + Dead Letter Exchange (DLX)**.
        1. **`delayed_exchange`**: Direct exchange.
        2. **`delayed_queue`**: Queue with `x-dead-letter-exchange` point to `global_exchange` (or `auction_events_exchange`) and `x-dead-letter-routing-key` = `auction.ended`.
        3. **`ended_queue`**: Queue bound to `global_exchange` with key `auction.ended`.
    - **Flow**:
        1. `CreateAuctionUseCase` publishes message to `delayed_exchange` with `expiration = (endTime - now)`.
        2. Message sits in `delayed_queue` (no consumers).
        3. Message expires -> moves to DLX (`global_exchange`) -> routes to `ended_queue`.
        4. Consumer on `ended_queue` triggers `EndAuctionUseCase`.

#### [NEW] `src/infrastructure/messaging/consumers/AuctionEndedConsumer.ts`
- Listens for `auction.ended`.
- Calls `EndAuctionUseCase`.

#### [MODIFY] `src/application/usecase/auction/CreateAuctionUseCase.ts`
- Publish message to `delayed_queue` upon creation.
- Message Content: `{ auctionId, endTime }`.
- TTL: `endTime.getTime() - Date.now()`.

#### [NEW] `src/application/usecase/auction/EndAuctionUseCase.ts`
- **Triggered By**: `AuctionEndedConsumer`.
- **Logic**:
    1. Fetch Auction by `auctionId` (Verify status is still `ACTIVE`).
        - *Edge Case*: If status is `CANCELLED`, ignore.
    2. **Winner Determination**:
        - If `bids.length > 0`:
             - Get `winnerId` and `currentBid`.
             - Call `walletService.settleAuction(winnerId, hostId, currentBid, auctionId)`.
             - **Success**: Set status `ENDED`, announce winner.
             - **Fail**: Log critical error (requires manual retry).
        - If `bids.length == 0`:
             - Set status `UNSOLD`.
    3. Broadcast `AUCTION_ENDED` event via Socket.

#### [MODIFY] `package.json`
- Remove `node-cron` (if added).

## Verification Plan
### Manual Verification
1. **Create Auction**: Create an auction ending in 2 minutes.
2. **Place Bid**: Use a test account to place a bid. Funds should be locked.
3. **Wait**: Wait for the delayed message to process (exactly at expiration).
4. **Check Status**:
    - Auction status should be `ENDED`.
    - Winner should be recorded.
    - **Wallet**: Winner's locked funds gone, Seller's balance increased.
5. **Logs**: Check `art-service` logs for "Auction X ended, winner Y".
