import { injectable } from "inversify";
import { Server } from "socket.io";
import { ISocketService } from "../../domain/interfaces/ISocketService";
import { redisPub, redisSub } from "../config/redis";
import { logger } from "../../utils/logger";

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

    this.io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id}`);
        socket.on("join_auction", (auctionId) => {
            logger.info(`Socket ${socket.id} joined auction ${auctionId}`);
            socket.join(`auction:${auctionId}`);
        });
        
        socket.on("leave_auction", (auctionId) => {
             socket.leave(`auction:${auctionId}`);
        });
    });

    // Subscribe to Redis
    if (redisSub) { 
        redisSub.subscribe("bid_placed", "auction_updated", (err) => {
            if(err) logger.error("Failed to subscribe to Redis channels", err);
        });

        redisSub.on("message", (channel, message) => {
            if (!this.io) return;
            try {
                const data = JSON.parse(message);
                
                if (channel === "bid_placed") {
                    // data is bid object with auctionId
                    this.io.to(`auction:${data.auctionId}`).emit("bid_placed", data);
                } else if (channel === "auction_updated") {
                    this.io.to(`auction:${data._id}`).emit("auction_updated", data);
                }
            } catch (e) {
                logger.error("Error parsing redis message", e);
            }
        });
    }
  }

  publishBid(bid: any): void {
      if (redisPub) redisPub.publish("bid_placed", JSON.stringify(bid));
  }

  publishAuctionUpdate(auction: any): void {
      if (redisPub) redisPub.publish("auction_updated", JSON.stringify(auction));
  }
}
