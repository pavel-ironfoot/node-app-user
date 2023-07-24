
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../common/errors";
import { UserModel, User } from "../models";

export class UserService {

    async addUser(
        login: string,
        password: string,
        isAdmin: boolean = false,
    ): Promise<User > {
        const foundUser = await UserModel.findOne({ login: login }).exec();
        if(foundUser){
            throw new HttpError(StatusCodes.CONFLICT,'Username already exist',"UserService");           
       }
        return UserModel.create({ login, password, isAdmin });
    }

    async loginUser(
        login: string,
        password: string,
        isAdmin: boolean = false,
    ): Promise<User[] | null> {
        const foundUser:any = await UserModel.findOne({ login: login }).exec();
        if(foundUser && foundUser.password===password){
               return foundUser;       
       }else{
            throw new HttpError(404,'User is not found or wrong password',"UserService"); 
       }
    }
}

export const userService = new UserService();