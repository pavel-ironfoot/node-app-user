import { postService } from './../services/postservice';
import express, { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import Joi, { ObjectSchema } from 'joi';
import { BaseController } from '../common/abstract/basecontroller';

const registerBodySchema:ObjectSchema<any> = Joi.object({
    login: Joi.string().min(3).max(254).required(),
    password: Joi.string().min(8).max(254).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])+$/).required(),
    email: Joi.string().min(3).max(254).required(),
    avatar: Joi.string().min(3).max(254),
    firstName: Joi.string().min(3).max(254),
    lastName: Joi.string().min(3).max(254),
    socials: Joi.object({
        facebook:Joi.string().min(3).max(254),
        instagram:Joi.string().min(3).max(254),
        twitter:Joi.string().min(3).max(254),
    }),
    age:Joi.number().min(18).$.max(150).required(),
    address1:Joi.string().min(10).max(254).required(),
    address2:Joi.string().min(10).max(254).required(),
    postIndex:Joi.number().min(6).max(6).required(),
});

const postSchema:ObjectSchema<any> = Joi.object({
    topic: Joi.string().min(10).max(64).required(),
    text: Joi.string().min(10).max(1000).required(),
    userId: Joi.string().required(),
});

export class UserController extends BaseController {
    // router: any = express.Router();
    constructor() {
        super();
        this.bindRoutes([{
            path:"/register",
            method: "post",
            handler:this.register,
            validators:{
                body:registerBodySchema,
            }
        },
        {
            path:"/login",
            method:"post",
            handler:this.login,
        },
        {
            path:"/:userId/posts",
            method:"post",
            handler:this.createPost,
            validators:{
                body:postSchema,
            }
        },
        {
            path:"/:userId/posts",
            method:"get",
            handler:this.showPost,
        },
        {
            path:"/:postId/posts",
            method:"patch",
            handler:this.updatePost
        },
        {
            path:"/:postId/posts",
            method:"delete",
            handler:this.deletePost,
        },
    ])
        // this.router.post('/register/', this.register);

        // this.router.post('/login', this.login);

        // this.router.post('/:userId/posts', this.createPost);

        // this.router.get('/:userId/posts', this.showPost);

        // this.router.patch('/:postId/posts', this.updatePost);

        // this.router.delete('/:postId/posts', this.deletePost);
    }

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        const { text, topic } = req.body;
        const updatePost = await postService.updateUserPost(req.params.postId, text, topic );
        res.send(updatePost);
    }

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        const deletePost = await postService.deleteUserPost(req.params.postId);
        deletePost;
        res.send('post delete');
    }

    showPost = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const { take, skip } = req.body;
        const showPosts = await postService.showUserPost(Number(take), Number(skip), userId);
        res.send(showPosts);
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        const { login, password } = req.body;
////////////////////////////
        const user = await userService.addUser(login, password);
        res.send(user);
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        const { login, password } = req.body;
        const response = await userService.loginUser(login, password)
        res.send(response);
    }

    createPost = async (req: Request, res: Response, next: NextFunction) => {
        const { text, topic } = req.body;
        const { userId } = req.params;
        const user = await postService.createPost(text, topic, userId)
        res.send(user);
    }

}

export const usercontroller = new UserController();

