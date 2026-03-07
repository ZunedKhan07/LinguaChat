import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async(req, res) => {
    const {name, email, password, preferredLanguage} = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are require!");
    }

    const existedUser = await User.findOne({ email })
    if (existedUser) {
        throw new ApiError(409, "User Already Exist!");
    }

    const user = await User.create({
        name,
        email,
        password,
        preferredLanguage: preferredLanguage || "en"
    })

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Ragistered Successfully! 🚀")
    )
});

const loginUser = asyncHandler( async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new ApiError(404, "All fields are required!")
    }

    const user = await User.findOne({ email });

    if(!user){
        throw new ApiError(401, "User not Found!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(402, "Invalid credentials!")
    }

    const accessToken = user.generateAccessToken()

    const loggedInUser = await User.findById(user._id).select("-password");

    const option= {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, option)
        .json(
            new ApiResponse(
                201,
                {user: loggedInUser, accessToken},
                "✅ Logined Successfully!"
            )
    )
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logout ho gaya! Bye bye. 👋"));
});


export {
    registerUser,
    loginUser,
    logoutUser
}