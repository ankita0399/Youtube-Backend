import { Router } from "express";
import { 
  changeCurrentPassword, 
  getCurrentUser, 
  getUserChannelProfile, 
  getWatchHistory, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  registerUser, 
  updateAccountDetails, 
  updateUserAvatar, 
  updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  registerUser
);

router.route('/login').post(
  loginUser
);

//Secured Routes
router.route('/logout').post(
  verifyJWT,
  logoutUser
);

router.route('/refresh-token').post(
  refreshAccessToken
); // Here we're not using the verifyJWT middleware as we're refreshing the token using the refresh token which is not expired yet 

router.route('/change-password').post(
  verifyJWT, //logged in log hi use kr skte hai 
  changeCurrentPassword
);

router.route('/current-user').get(
  verifyJWT,
  getCurrentUser
);

router.route('/update-account').patch(
  verifyJWT,
  updateAccountDetails
);

router.route('/update-avatar').patch(
  verifyJWT,
  upload.single('avatar'), // here we are using single as we are only uploading one file
  updateUserAvatar
);

router.route('/update-cover-image').patch(
  verifyJWT,
  upload.single('coverImage'), // here we are using single as we are only uploading one file
  updateUserCoverImage
);

router.route('/channel/:username').get(
  verifyJWT,
  getUserChannelProfile
)

router.route('/watchHistory').get(
  verifyJWT,
  getWatchHistory
)

export default router;