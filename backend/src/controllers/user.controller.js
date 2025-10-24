import User from '../models/user.models.js'
import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import {genrateToken} from "../utils/generateToken.js"


 // register user
 export const register = asyncHandler (async (req, res) => {
     const {name, email, username, password} = req.body;

     if (
        [name, email, username, password].some((idx) => idx?.trim()==="" )
    ) {
        throw new ApiError(400, "All field is required")
     }

    const existUser = await User.findOne({
        $or: [{username}, {email}]
    })
    
    if (existUser) {
        throw new ApiError(400, "User already exits")
    }

    const newUser = await User.create({
        name,
        email,
        username,
        password,
        
    })

    if (newUser) {
        genrateToken(res, newUser._id);

        res.status(201).json({
            _id: newUser._id,
            name : newUser.name,
            email : newUser.email,
            username: newUser.username,
            role: newUser.role
        })
    }
 })

  export const login = asyncHandler (async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new ApiError(400, "email and password is empty")
    }

    const user = await User.findOne({email});
     if (!user) {
        throw new ApiError(400, "user does't exist")
     }

     if (user && (await user.matchPassword(password))) {
        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn: '15d'}
        );

        // set cookie
     res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30*24*60*60*100 // 30 days
     });

     // also return token in response  for api  testing
     res.json({
        _id : user._id,
        name : user.name,
        email : user.email,
        role : user.role,
        token: token // add this line
     });
     } else{
        throw new ApiError(400, "Invalid email id");
     }

     

  })

  export const logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly : true,
        expires: new Date(0),
    });
    res.status(200).json({message: 'Logged out successfully'})
  })

  export const getProfile = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email : user.email,
            role : user.role
        });
    }  else{
        throw new ApiError(400, "user not found");
    }
  })