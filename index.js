import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken"
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv"

dotenv.config()


const app = express()

app.use(bodyParser.json())

app.use(
    (req,res,next)=>{
        const value = req.header("Authorization")
        if(value != null){
            const token = value.replace("Bearer ","")
            jwt.verify(token,process.env.JWT_SECRET,
                (err,decoded)=>{
                    if(decoded==null){
                        res.status(403).json({
                            message : "Unauthorized"
                        })
                    }else{
                        req.user = decoded
                        next()
                    }  
                }

            )
        }else{
            next()
        }
    }
)

const connectionString = process.env.MONGO_URI
mongoose.connect(connectionString).then(
    ()=>{
        console.log("DB Connected Successfully")
    }
).catch(()=>{
    console.log("Failed DB Connect.")
})



app.use("/api/users",userRouter)
app.use("/api/products",productRouter)


app.delete("/", (req,res)=>{
    res.json({
        message: "This is a DELETE request"
    })
    console.log("This is a DELETE request.")
})

app.put("/", (req,res)=>{
    res.json({
        message: "This is a PUT request"
    })
    console.log("This is a PUT request.")
})

app.listen(5000, ()=>{
    console.log("Server Started")
} )