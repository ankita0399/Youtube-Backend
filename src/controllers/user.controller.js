import { asyncHandler } from '../utils/asyncHandler.js';
import { APIError } from '../utils/APIError.js';
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { APIResponse } from '../utils/APIResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    console.log('user', { ...user });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new APIError(500, 'Error while generating tokens');
  }
}

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend or payload body
  // validation of user details
  // check if user already exists in the database: username, email
  // check for images
  // check for avatar 
  // upload images to cloudinary, avatar 
  // create user in the database 
  //remove password and refresh token fields from the response
  // check for user creation
  // return res 

  const { username, fullName, email, password } = req.body

  // if ( fullName === "" ){
  //   throw new APIError(400, 'Full Name is required');
  // }

  if ([fullName, email, username, password].some((field) =>
    field?.trim() === "" || field === undefined
  )) {
    throw new APIError(400, 'All fields are required');
  }

  const exsistingUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  })

  if (exsistingUser) {
    throw new APIError(400, 'User with email or username already exists');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path //path to the uploaded file
  // console.log('avatarLocalPath', avatarLocalPath);
  const coverImageLocalPath = req.files?.coverImage[0]?.path //path to the uploaded file

  if (!avatarLocalPath) {
    throw new APIError(400, 'Avatar is required');
  }

  // upload images to cloudinary
  const avatarCloudinary = await uploadToCloudinary(avatarLocalPath);

  // console.log('avatarCloudinary', avatarCloudinary);
  const coverImageCloudinary = await uploadToCloudinary(coverImageLocalPath);

  if (!avatarCloudinary) {
    throw new APIError(500, 'Error uploading avatar to cloudinary');
  }

  const createUser = await User.create({
    fullName,
    avatar: avatarCloudinary,
    coverImage: coverImageCloudinary || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const getUser = await User.findById(createUser._id).select(
    '-password -refreshToken'
  ) //remove password and refresh token fields from the response

  if (!getUser) {
    throw new APIError(500, 'ERROR CREATING USER');
  }

  if (getUser) {
    res.status(201).json(
      new APIResponse(200, getUser, 'USER CREATED SUCCESSFULLY')
    )
  }

})

const loginUser = asyncHandler(async (req, res) => {
  // get user details from req body
  // check if user exists in db : username, email
  // find user in the database
  // check for password is correct 
  // unhash password and check if it matches the password in the database
  // access token and refresh token 
  // send cookie with refresh token 

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new APIError(400, 'Username or Email is required');
  }

  const user = await User.findOne({
    $or: [{ email: email }, { username: username }]
  });

  if (!user) {
    throw new APIError(404, 'User not found');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new APIError(401, 'Invalid password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new APIResponse(
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
      'User logged in successfully'
    ));

});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new APIResponse(200, {}, 'User logged out successfully'));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get refresh token from the cookie
  // check if refresh token is valid
  // generate new access token
  // send new access token

  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new APIError(401, 'Unauthorized Request');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new APIError(404, 'USER NOT FOUND');
    }

    // check if the refresh token in the database is the same as the incoming refresh token
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new APIError(401, 'REFRESH TOKEN INVALID');
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(new APIResponse(200, {
        accessToken, refreshToken: newRefreshToken
      }, 'Access Token Refreshed Successfully', { user: user }
      ));

  } catch (error) {
    throw new APIError(401, error?.message || 'INVALID REFRESH TOKEN');
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)
  isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new APIError(400, "INCORRECT OLD PASSWORD")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false }); // We're not validating the user model before saving it to the database as we're not updating all the fields

  return res
    .status(200)
    .json(new APIResponse(200, {}, "PASSWORD CHANGED SUCCESSFULLY"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new APIResponse(200, req.user, "USER DETAILS FETCHED SUCCESSFULLY")
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new APIError(400, 'Full Name and Email are required');
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { //mongoose update operator to update the fields in the database 
        fullName,
        email
      }
    },
    {
      new: true
    }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(new APIResponse(200, user, 'ACCOUNT DETAILS UPDATED SUCCESSFULLY'));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new APIError(400, 'AVAATAR IS REQUIRED');
  }

  const avatar = await uploadToCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new APIError(500, 'ERROR UPLOADING AVATAR TO CLOUDINARY');
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar?.url
      }
    },
    {
      new: true
    }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(new APIResponse(200, user, 'AVATAR UPDATED SUCCESSFULLY'));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!coverImageLocalPath) {
    throw new APIError(400, 'COVER IMAGE IS REQUIRED');
  }

  const coverImage = await uploadToCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new APIError(500, 'ERROR UPLOADING COVER IMAGE TO CLOUDINARY');
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage?.url
      }
    },
    {
      new: true
    }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(new APIResponse(200, user, 'COVER IMAGE UPDATED SUCCESSFULLY'));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim) {
    throw new APIError(400, "USERNAME IS MISSING");
  }

  const channel = await User.aggregate([ //aggregate is used to perform complex queries in mongodb
    {
      $match: {
        username: username?.toLowerCase()
      } //match the username in the database with the username in the request params
    },
    {
      $lookup: { //lookup is used to join collections in mongodb 
        from: 'subscriptions', //collection to join
        localField: '_id', //field in the user collection
        foreignField: 'channel', //field in the subscriptions collection
        as: 'subscribers' //alias for the joined collection
      } //lookup the subscriptions collection to get the subscribers of the channel
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscriptions'
      } //lookup the subscriptions collection to get the subscriptions of the channel
    },
    {
      $addFields: { //addFields is used to add new fields to the document
        subscribersCount: {
          $size: $subscribers //size operator is used to get the length of the subscribers array or object
        }, //get the count of the subscribers
        subscriptionsCount: {
          $size: $subscriptions
        },
        isSubscribed: { //check if the user is subscribed to the channel
          if: {
            $in: [req.user?._id, '$subscribers.subscriber'] //$in operator checks if the user is in the subscribers array or object
          } //check if the user is in the subscribers array
        }
      }
    },
    {
      $project: { //project is used to select the fields to return in the response
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        subscriptionsCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1
      } // Here we're selecting the fields to return in the response by setting the value to 1 
    }
  ]);

  console.log('CHANNEL PROFILE', channel);

  if (!channel?.length) {
    throw new APIError(404, "CHANNEL DOES NOT EXIST");
  }

  return res
    .status(200)
    .json(new APIResponse(200, channel[0], "USER CHANNEL PROFILE FETCHED SUCCESSFULLY"));

});

const getWatchHistory = asyncHandler(async (req, res) => {
  // req.user?._id // this will give string value of the user id 

  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id) //convert the user id to a mongoose object id 
      }
    },
    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as: 'watchHistory',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  } //project is used to select the fields to return in the response
                },
                {
                  $addFields: {
                    owner: {
                      // $arrayElemAt: ['$owner', 0] //get the first element of the array
                      $first: '$owner' //get the first element of the array
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ])

  return res
    .status(200)
    .json(new APIResponse(200, user[0]?.watchHistory, "WATCH HISTORY FETCHED SUCCESSFULLY"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
};