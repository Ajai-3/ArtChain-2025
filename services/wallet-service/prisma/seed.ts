/// <reference types="node" />
import { PrismaClient, TransactionType, TransactionCategory, TransactionStatus, Method } from '@prisma/client';

const prisma = new PrismaClient();

const USER_1 = 'cmexta8ae0000bs8ktuvvq5qd';
const USER_2 = 'cmf6luw8t0000bsz8s7fhj3hh';
const ADMIN_ID = 'admin-platform-wallet-id';

async function main() {
  console.log('Seeding Wallets...');

  const users = [USER_1, USER_2, ADMIN_ID];

  for (const userId of users) {
    const existing = await prisma.wallet.findUnique({ where: { userId } });
    if (!existing) {
      await prisma.wallet.create({
        data: {
          userId,
          balance: 10000,
          status: 'active'
        }
      });
      console.log(`Created wallet for ${userId}`);
    } else {
        console.log(`Wallet exists for ${userId}`);
    }
  }

  console.log('Seeding Transactions...');
  
  // Clear recent transactions to avoid clutter if re-running
  // await prisma.transaction.deleteMany({});

  const transactionScenarios = [
      { type: 'DEPOSIT', category: TransactionCategory.TOP_UP, transType: TransactionType.credited },
      { type: 'PURCHASE', category: TransactionCategory.PURCHASE, transType: TransactionType.debited },
      { type: 'SALE', category: TransactionCategory.SALE, transType: TransactionType.credited },
      { type: 'COMMISSION_PAYMENT', category: TransactionCategory.COMMISSION, transType: TransactionType.credited }
  ];
  
  for (let i = 0; i < 20; i++) {
    const scenario = transactionScenarios[Math.floor(Math.random() * transactionScenarios.length)];
    const amount = Math.floor(Math.random() * 500) + 10;
    
    // Distribute users
    const userId = i % 3 === 0 ? ADMIN_ID : (i % 2 === 0 ? USER_1 : USER_2);
    
    // For admin, mostly credits (Platform Fees aka Commissions)
    if (userId === ADMIN_ID) {
        const adminWallet = await prisma.wallet.findUnique({ where: { userId: ADMIN_ID } });
        if (!adminWallet) continue;

         await prisma.transaction.create({
            data: {
                walletId: adminWallet.id,
                amount: amount * 0.05, // Fee
                type: TransactionType.credited, // Receiving fee
                category: TransactionCategory.COMMISSION,
                status: TransactionStatus.success,
                method: Method.art_coin,
                externalId: `ref_fee_${i}`,
                description: `Platform fee for transaction ${i}`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
            }
        });
        continue;
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) continue;

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount: amount,
        type: scenario.transType,
        category: scenario.category,
        status: TransactionStatus.success,
        method: Method.art_coin,
        externalId: `ref_${i}`,
        description: `${scenario.category} transaction`,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      }
    });

    // Create counterpart transaction for transfers (Simulation of Purchase -> Sale)
    if (scenario.category === TransactionCategory.PURCHASE) {
        const sellerId = userId === USER_1 ? USER_2 : USER_1;
        const sellerWallet = await prisma.wallet.findUnique({ where: { userId: sellerId } });
         if (sellerWallet) {
            await prisma.transaction.create({
                data: {
                    walletId: sellerWallet.id,
                    amount: amount,
                    type: TransactionType.credited,
                    category: TransactionCategory.SALE,
                    status: TransactionStatus.success,
                    method: Method.art_coin,
                    externalId: `ref_${i}_sale`,
                    description: `Sale proceeds`,
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
                }
            });
         }
    }
  }

  console.log('Wallet Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
