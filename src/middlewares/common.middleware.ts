import { NextFunction, Request, Response } from "express";

class CommonMiddleware {
    public isIdValidate(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {};
    }
}
