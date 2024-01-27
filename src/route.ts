import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router : Router = express.Router();

export function healthRoute() : Router {
    router.get('/notification-health',(_req:Request,res:Response) => {
        res.status(StatusCodes.OK).send('Notification service is up and running');
    });
    return router;
}