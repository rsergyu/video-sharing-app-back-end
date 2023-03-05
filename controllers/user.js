import { createError } from "../error.js"
import User from "../models/User.js"
import Video from "../models/Video.js"

export const update = async (req,res, next) => {
    if (req.params.id === req.user.id){
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body
            }, {new: true})
            res.status(200).json(updatedUser)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can update only your account"))
    }

}
export const deleteUser = async (req,res, next) => {
    if (req.params.id === req.user.id){
        try {
            await User.findByIdAndDelete(req.params.id)
                
            res.status(200).json("User deleted!")
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can delete only your account"))
    }

}
export const getUser = async (req,res, next) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, ...other} = user._doc
        res.status(200).json(other)
    } catch (err) {
        next(err)
    }
}
export const subscribe = async (req,res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $addToSet:{subscribedUsers:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,{
            $addToSet:{subscribers:req.user.id}
        })
        res.status(200).json("You have subscribed!")
    } catch (err) {
        next(err)
    }
}
export const unsubscribe = async (req,res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id,{
            $pull:{subscribedUsers:req.params.id}
        })
        await User.findByIdAndUpdate(req.params.id,{
            $pull:{subscribers:req.user.id}
        })
        res.status(200).json("You have unsubscribed!")
    } catch (err) {
        next(err)
    }
}
export const like = async (req,res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.videoId,{
            $addToSet: {likes: req.user.id},
            $pull: {dislikes: req.user.id}
        })
        res.status(200).json("The video has been liked")
    } catch (err) {
        next(err)
    }
}
export const dislike = async (req,res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.videoId,{
            $pull: {likes: req.user.id} ,
            $addToSet: {dislikes: req.user.id}
        })
        res.status(200).json("The video has been disliked")
    } catch (err) {
        next(err)
    }
}
