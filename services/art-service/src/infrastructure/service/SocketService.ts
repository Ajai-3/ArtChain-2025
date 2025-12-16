import { injectable } from "inversify";
import { Server } from "socket.io";
import { ISocketService } from "../../domain/interfaces/ISocketService";
import { redisPub, redisSub } from "../config/redis";
import { logger } from "../../utils/logger";
import { registerAuctionEvents } from "../socket/auctionHandler";
import { authMiddleware } from "../../presentation/middleware/authMiddleware";

@injectable()
export class SocketService implements ISocketService {
  private io: Server | undefined;

  initialize(server: any): void {
    this.io = new Server(server, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST"]
      }
    });

    this.io.use(authMiddleware);

    this.io.on("connection", (socket) => {
        console.log(`🔌 [SocketService] Connection established: ${socket.id} (User: ${socket.data.userId})`);
        registerAuctionEvents(this.io!, socket);
    });

    if (redisSub) { 
        redisSub.subscribe("bid_placed", "auction_updated", (err) => {
            if(err) console.error("❌ [SocketService] Redis Subscribe Error:", err);
            else console.log("✅ [SocketService] Subscribed to Redis channels: bid_placed, auction_updated");
        });

        redisSub.on("message", (channel, message) => {
            if (!this.io) return;
            try {
                const data = JSON.parse(message);
                console.log(`📨 [SocketService] Received Redis message on ${channel}:`, data);
                
                if (channel === "bid_placed") {
                    // Broadcast globally as requested so all clients (list view etc) can update
                    this.io.emit("bid_placed", data);
                    console.log(`📢 [SocketService] Broadcasted 'bid_placed' to ALL clients`);
                } else if (channel === "auction_updated") {
                    this.io.emit("auction_updated", data);
                    console.log(`📢 [SocketService] Broadcasted 'auction_updated' to ALL clients`);
                }
            } catch (e) {
                console.error("❌ [SocketService] Error parsing redis message", e);
            }
        });
    }
  }

  publishBid(bid: any): void {
      // Broadcast locally immediately
      if (this.io) {
          this.io.emit("bid_placed", bid);
          console.log(`📢 [SocketService] Emitted 'bid_placed' locally`);
      }
      // Publish to Redis for other instances
      if (redisPub) redisPub.publish("bid_placed", JSON.stringify(bid));
  }

  publishAuctionUpdate(auction: any): void {
      if (this.io) {
          this.io.emit("auction_updated", auction);
          console.log(`📢 [SocketService] Emitted 'auction_updated' locally`);
      }
      if (redisPub) redisPub.publish("auction_updated", JSON.stringify(auction));
  }

  publishAuctionEnded(data: any): void {
      if (this.io) {
          this.io.emit("auction_ended", data);
          console.log(`📢 [SocketService] Emitted 'auction_ended' locally`);
      }
      // Assuming we want to sync this across instances too
      if (redisPub) redisPub.publish("auction_ended", JSON.stringify(data));
  }
}
