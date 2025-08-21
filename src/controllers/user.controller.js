import { response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    
    //               logics 
/*  get users details from frontend
    validation - not empty
    check if user already exist : email,username 
    check for images and avatar
    upload them to cludinary: avtar
    create user object - create entry in db 
    remove password and refresh token field from the response
    check for new user creation 
    return response   */

    const {username, email, fullName, password} = req.body
    console.log("email : ", email)
    
    if([username,email,fullName,password].some( (field) => 
        field?.trim() === ""
    )){
        throw new ApiError(409, "All fields are reqired!")
    }

    const existedUser = User.findOne({
        $or : [{email},{username}]
    })

    if( existedUser){
        throw new ApiError(40, "User already exist")
    }

    // now check for avatar and image by multer middleware
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required!")
    }

    // now create user obj and save data in db
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        fullName,
        avatar: avatar.url,
        coverImage : coverImage?.url || "",
    })

    // check if user is created or not and remove password and refresh token so than it does not display
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Somthing went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )
})

export { registerUser }