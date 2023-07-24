import express from "express";
import { usercontroller } from "./controllers";
import bodyparser from "body-parser";
import morgan from 'morgan';
import cors from "cors-ts";
import helmet from "helmet";
import mongoose from "mongoose";

mongoose.set('strictQuery', false);

export class App {
    app = express();
    port = 8000;

    useRoutes(){
        this.app.use("/users", usercontroller.router);
    }

    useMiddlewares(){
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan(':date[iso] ":method :url" :status :res[content-length]'));
       this.app.use(bodyparser.urlencoded({extended:true}))
    }

    async initDb(){
        await mongoose.connect('mongodb://127.0.0.1:27017/homework17');
        // mongodb://localhost:27017
        console.log('Database connection established successfully');
    }

    async init(){
        this.useMiddlewares();
        this.useRoutes();
        await this.initDb();
        this.app.listen(this.port, ()=>{
            console.log('Server is listening on: http://localhost:%s',this.port)
        })
        process.on('uncaughtException', (err:Error)=>{
            console.log('Uncaught error',err.message);
        })
        process.on('unhandledRejection', (err:Error)=>{
            console.log('Uncaught ASYNC error',err.message);
        })
    }
}

(async()=>{
    const app = new App();
    app.init();
})();

