import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import { APIError } from "../utils/APIError.js"
import { APIResponse } from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}