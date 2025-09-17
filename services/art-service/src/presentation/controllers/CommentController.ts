import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { validateWithZod } from "../../utils/validateWithZod";
import { COMMENT_MESSAGES } from "../../constants/CommentMessages";
import { ICommentController } from "../interface/ICommentController";
import { createCommentSchema } from "../validators/createCommentSchema";
import { CreateCommentDTO } from "./../../domain/dto/comment/CreateCommentDTO";
import { CreateCommentUseCase } from "../../application/usecase/comment/CreateCommentUseCase";
import { GetCommentsUseCase } from "../../application/usecase/comment/GetCommentsUseCase";

export class CommentController implements ICommentController {
  constructor(private readonly _createCommentUseCase: CreateCommentUseCase, private readonly _getCommentsUseCase: GetCommentsUseCase) {}
  //# ================================================================================================================
  //# CREATE NEW COMMENT
  //# ================================================================================================================
  //# POST /api/v1/art/comments
  //# Request body: { postId, content }
  //# This controller creates a new comment for a given art post.
  //# ================================================================================================================
  createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        logger.error("Missing x-user-id header in createComment");
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Missing x-user-id header" });
      }
      console.log(req.body)

      const result = validateWithZod(createCommentSchema, req.body);

      const dto: CreateCommentDTO = { ...result, userId };
      const comment = await this._createCommentUseCase.execute(dto);

      logger.info(`Comment created successfully for postId=${dto.postId} by userId=${userId}`);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: COMMENT_MESSAGES.CREATE_SUCCESS, comment: comment });
    } catch (error) {
      logger.error("Error in createComment", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# EDIT COMMENT
  //# ================================================================================================================
  //# PUT /api/v1/art/comments/:id
  //# Request body: { content }
  //# This controller edits an existing comment by ID.
  //# ================================================================================================================
  editComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.headers["x-user-id"] as string;

      logger.info(`Editing comment id=${id} by userId=${userId}`);

      // TODO: update comment in DB

      return res
        .status(HttpStatus.OK)
        .json({ message: COMMENT_MESSAGES.EDIT_SUCCESS });
    } catch (error) {
      logger.error("Error in editComment", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET COMMENTS FOR A POST
  //# ================================================================================================================
  //# GET /api/v1/comments/:postId
  //# Request params: postId, page, limit
  //# This controller fetches all comments for a specific art post.
  //# ================================================================================================================
  getComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { postId } = req.params;
      const userId = req.headers["x-user-id"] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      logger.info(`Fetching comments for postId=${postId}, userId=${userId}, page=${page}, limit=${limit}`);

      const comments = await this._getCommentsUseCase.execute(postId, page, limit)

      return res
        .status(HttpStatus.OK)
        .json({ message: COMMENT_MESSAGES.FETCH_SUCCESS, data: comments });
    } catch (error) {
      logger.error("Error in getComments", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# DELETE COMMENT
  //# ================================================================================================================
  //# DELETE /api/v1/art/comments/:id
  //# Request params: id
  //# This controller deletes a comment by ID.
  //# ================================================================================================================
  deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const userId = req.headers["x-user-id"] as string;

      logger.info(`Deleting comment id=${id} by userId=${userId}`);

      // TODO: delete comment from DB

      return res
        .status(HttpStatus.OK)
        .json({ message: COMMENT_MESSAGES.DELETE_SUCCESS });
    } catch (error) {
      logger.error("Error in delete", error);
      next(error);
    }
  };
}
