import express from "express";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user/UserRepositoryImpl";
import { SupporterRepositoryImpl } from "./../../../infrastructure/repositories/user/SupporterRepositoryIml";
import { ElasticUserController } from "../../controllers/user/ElasticUserController";
import { SearchUserUseCase } from "../../../application/usecases/user/search/SearchUserUseCase";
import { userController } from "../../../infrastructure/container/user/userContainer";

import { Request, Response, NextFunction } from "express";
import { logger, storeUserInfo } from "../../../logger/logger";
import { artistRequestController } from "../../../infrastructure/container/user/artistRequestContainer";

const router = express.Router();


const searchUserUseCase = new SearchUserUseCase();
const elasticUserController = new ElasticUserController(searchUserUseCase);



router.get("/profile", userController.getUserProfile);
router.get("/profile/:userId", userController.getUserProfileWithId);

router.post("/support/:userId", userController.supportUser);
router.delete("/un-support/:userId", userController.unSupportUser);


router.get('/search', elasticUserController.searchUsers);


router.post("/artist-request", artistRequestController.createArtistRequest);
router.get("/artist-request/status", artistRequestController.hasUserSubmittedRequest)

router.get("/info", async (req: Request, res: Response, next: NextFunction) => {
 try {
    const user = {
      userId: "123",
      name: "Ajai",
      username: "ajai123",
      email: "ajai@example.com"
    };

    logger.info("User created", { userId: user.userId });

    await storeUserInfo(user);

    res.send({ status: "success", message: "Info logs created ✅" });
  } catch (err) {
    logger.error("Error storing user info", { error: err });
    res.status(500).send({
      status: "error",
      error: {
        code: "InternalServerError",
        message: (err as Error).message,
        statusCode: 500
      }
    });
  }
});
router.get("/warn", (req: Request, res: Response, next: NextFunction) => {
  logger.warn("This is a warning");
  res.send("Warning log created ⚠️");
});

router.get("/error", (req: Request, res: Response, next: NextFunction) => {
  logger.error("Something went wrong", { errorCode: 500 });
  res.send("Error log created ❌");
});

export default router;
