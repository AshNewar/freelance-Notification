import express ,{Express} from 'express';
import { start } from '@notifications/server';

function intialize(){
    const app:Express = express();
    start(app);
}
intialize();