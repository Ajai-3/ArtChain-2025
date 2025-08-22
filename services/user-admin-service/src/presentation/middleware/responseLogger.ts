import { Request, Response, NextFunction } from 'express';

export function responseInterceptor(req: Request, res: Response, next: NextFunction) {
  const oldJson = res.json;
  res.json = function (data: any) {
    const modifiedData = {
      ...data,
      interceptedAt: new Date().toISOString(),
    };
    return oldJson.call(this, modifiedData);
  };
  next();
}
