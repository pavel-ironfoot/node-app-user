import { Post, PostModel } from "../models/postmodels";
import { Types } from "mongoose";
import { HttpError } from "../common/errors";
import { StatusCodes } from "http-status-codes";

export class PostService {

    async updateUserPost(
        id: string,
        text: string,
        topic: string,
  
    ): Promise<Post[] | null> {
        const data:any = {text,topic}
        return PostModel.findByIdAndUpdate(id,data,{new:true});
    }

    async deleteUserPost(
        id: string,       
    ): Promise<Post[] | null | any> {
        
                PostModel.findById(id, (err:any, user:any) => {
                    if (err) {
                        throw new HttpError(404,'Element not found for the given ID',"UserService");
                    } 
            return PostModel.findByIdAndRemove(id);
        });
    }

    async createPost(
        text: string,
        topic: number,
        ownerId: string,
    ): Promise<Post> {
        return PostModel.create({ text, topic, owner:new Types.ObjectId(ownerId) });
    }

    async showUserPost(
        take: number,
        skip: number,
        ownerId: string,
        isAdmin: boolean = false,
    ): Promise<Post[] | null> {

       const post: Post[] = await PostModel.find({owner: ownerId}).skip(skip).limit(take);
        return post;
    }
}

export const postService = new PostService();