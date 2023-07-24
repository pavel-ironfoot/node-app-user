import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
    schemaOptions: { versionKey:false, timestamps:true},
})

export class User {
    @prop({id:true})
    id!:Types.ObjectId;

    @prop({required:true})
    login!:string;

    @prop({required:true})
    password!:string;

    @prop({required:true})
    email!:string;

    @prop({required:false})
    avatar!:string;

    @prop({required:false})
    firstName?:string;

    @prop({required:false})
    lastName?:string;

    @prop({required:false})
    socials?:object;

    @prop({required:true})
    age!:number;

    @prop({required:true})
    address1!:string;

    @prop({required:true})
    address2!:string;

    @prop({required:false, default:false})
    isAdmin?:boolean;
}

export const UserModel = getModelForClass(User);