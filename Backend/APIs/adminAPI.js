import exp from "express"
import {UserModel} from "../models/userModel.js"
import {ArticleModel} from "../models/articleModel.js"
import {hash,compare} from "bcrypt"
import jwt from 'jsonwebtoken'
import { verifyToken } from "../middleware/verifyToken.js"
export const adminApp = exp.Router()


//get all users and authors
adminApp.get("/users", verifyToken("ADMIN"), async (req, res) => {
    const list = await UserModel.find()

    res.status(200).json({message: "users",payload: list})
})


//block or activate user & author
adminApp.put("/users", verifyToken("ADMIN"), async (req, res) => {
    const { userId } = req.body

    const user = await UserModel.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    user.isUserActive = !user.isUserActive
    await user.save()

    res.status(200).json({ message: `User ${user.isUserActive ? 'activated' : 'blocked'}` })
})

//get all articles
adminApp.get("/articles", verifyToken("ADMIN"), async (req, res) => {
    const articles = await ArticleModel.find()
    res.status(200).json({message: "articles", payload: articles})
})