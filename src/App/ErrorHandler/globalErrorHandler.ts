import { ErrorRequestHandler } from "express";
import configs from "../configs";
import { ZodError } from "zod";
import AppError from "../errors/AppError";
import { TErrorHandler, TErrorSource } from "../interface/error";

export const globalErrorHandler: ErrorRequestHandler = (err,req,res,next)=>{

    let statusCode = err.statusCode || 500
    let message = err.message || "Something went wrong!"

    let errorSource : TErrorSource = [
        {
            path: "",
            message: "something went wrong"
        }
    ]


    const handleError = (errorHandler:TErrorHandler)=>{
        const simplifiedError = errorHandler(err)
        statusCode = simplifiedError?.statusCode 
        message = simplifiedError?.message
        errorSource = simplifiedError?.errorSource
    }


    if(err instanceof ZodError){
        // zod error handler
     console.log(err);   
    } else if(err?.name === 'ValidationError'){
        // mongoose validation error
    }else if(err?.name === "CastError"){
        // mongoose invalid type of input //castError
    }else if(err?.code === 11000){
      // E11000 duplicate key error (while we enter duplicate data to DB)
    }else if (err?.code === 31254){
        // mongoose query error
    }else if (err instanceof AppError || err instanceof Error){
        statusCode = err instanceof AppError && err.statusCode;
        message = err?.message;
        errorSource = [
            {
                path: "",
                message : err?.message
            }
        ]
    }


      return res.status(statusCode).json({
        success: false,
        message: message,
        errorSource,
        err,
        stack: configs.node_env === 'development' ? err?.stack : null,
      });
}