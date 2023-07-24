import { StatusCodes } from "http-status-codes";

export class ValidationError extends Error {
    validationErrors:any[]

    constructor(errors: any[]) {
        super();
        this.validationErrors = errors;
    }
}