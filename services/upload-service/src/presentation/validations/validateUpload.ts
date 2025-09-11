import { Request } from 'express';
import { z, ZodError } from 'zod';
import { uploadSchema } from './uploadSchema';
import { logger } from '../../infrastructure/utils/logger';

export const validateUpload = (
  req: Request,
  type: 'profile' | 'banner' | 'art' | 'backgound'
) => {
  try {
    const previousFileUrl = req.body.previousFileUrl as string | undefined;
    const validated = uploadSchema.parse({
      userId: req.headers['x-user-id'],
      file: req.file,
      previousFileUrl
    });

    logger.debug(
      `Upload ${type} request received | userId=${validated.userId} | file=${validated.file.originalname}`
    );

    return {
      userId: validated.userId,
      file: validated.file,
      previousFileUrl
    };
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = err.issues.map((issue) => issue.message).join(', ');
      logger.warn(
        `Upload ${type} failed | userId=${req.headers['x-user-id'] || 'unknown'} | reason=${messages}`
      );
      throw err;
    }
    throw err;
  }
};
