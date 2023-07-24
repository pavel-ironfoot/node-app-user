import { Request, Response, NextFunction } from 'express';
import { IcontrollerRoute, Validation } from './../types-and-interfaces';
import express, { Router } from 'express';
import { Logger } from "tslog";
import { ValidationError } from '../errors/validationerror';

export abstract class BaseController {
    private readonly _router:Router = Router();
    readonly logger  = new Logger();

    get router(): Router {
        return this._router;
    }

    protected bindRoutes(routes:IcontrollerRoute[]):void{
        for(const route of routes){
            this.logger.info(`Route attached [${route.method}] ${route.path}`);
            const handler = this.catchErrorHandler(route.handler);
            const pipeLine = [];
            if(route.validators){
                pipeLine.push(this.createValidators(route.validators))
            }
            this.router[route.method](route.path,pipeLine, handler);
        }
    }

    catchErrorHandler(handler:any){
        return async(req:Request, res:Response, next:NextFunction)=>{
            try{
                await handler.bind(this)(req, res, next)
            } catch (err) {
                next(err);
            }
        }
    }

    createValidators(validators: Validation){
        return (req:Request, res:Response, next:NextFunction)=>{
            let errors: any[] = [];
            const joiOptions = {
                abortEarly:false,
                allowUnknown:true,
                stripUnknown:true,
            };

            for (const validatorName of Object.keys(validators)){
                const result = validators[validatorName as keyof Validation].validate(
                    req[validatorName as keyof Request],
                    joiOptions
                );
            
                if (result.value){
                    req[
                        validatorName as keyof Pick<
                        Request,
                        "body" | "query" | "params" | "headers" | "cookies"
                        >
                    ] = result.value;
                }
                if(errors.length){
                    throw new ValidationError(errors);
                }

                next();
            }

        }
    }
}