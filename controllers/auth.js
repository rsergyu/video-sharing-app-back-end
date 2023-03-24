import mongoose from "mongoose";
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import {createError} from '../error.js'
import jwt  from "jsonwebtoken";

export const signup = async (req,res,next) =>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({...req.body, password: hash});
        await newUser.save();

       res.status(200).send("User saved succesfully!")

    }catch(err){
        next(err)
    }}
    
export const signin = async (req,res,next) =>{
    try{
        const user = await User.findOne({$or: [
            {name: req.body.name},
            {email: req.body.name}]})
            if(!user) return next(createError(404, "User not found!"))
                
            const isCorrect = await bcrypt.compare(req.body.password, user.password)
                
            if(!isCorrect) return next(createError(400, "Wrong credentials!"))
                
            const token = jwt.sign({id:user._id}, process.env.JWT)
            const {password, ...other} = user._doc;
                
            res.cookie("access_token", token, {
                httpOnly: true, secure: true, sameSite: 'none',
                }).status(200).json(other);
                
    }catch(err){
        next(err)
    }
}

export const googleAuth = async (req,res,next) =>{
    try{ 
        const user = await User.findOne({email: req.body.email})
        if(user){
            const isCorrect = await bcrypt.compare(req.body.password, user.password)
            if(!isCorrect) return next(createError(400, "Wrong credentials!"))

            const token = jwt.sign({id:user._id}, process.env.JWT)
            const {password, ...other} = user._doc;
            
            res.cookie("access_token", token, {
                httpOnly: true, secure: true, sameSite: 'none', 
            }).status(200).json(other);
        } else {   
            
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            
            const newUser = new User({...req.body, password: hash ,googleUser: true});
            const savedUser = await newUser.save();
            const {password, ...other} = savedUser._doc;
            

            const token = jwt.sign({id:savedUser._id}, process.env.JWT)
            
            res.cookie("access_token", token, {
                httpOnly: true, secure: true, sameSite: 'none',
            }).status(200).json(other);
        }
        
    }catch(err){
        next(err)
    }}