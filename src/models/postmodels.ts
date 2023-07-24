import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
    schemaOptions: { versionKey:false, timestamps:true},
})

export class Post {
    @prop({id:true})
    id!:Types.ObjectId;

    @prop({required:true})
    text!:string;

    @prop({required:true})
    topic!:string;

    @prop({required:true})
    owner!:Types.ObjectId;
}

export const PostModel = getModelForClass(Post);