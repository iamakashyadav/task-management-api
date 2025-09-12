import express from "express";
import { login, register, updateProfile } from "../controllers/user.js";
import validate from "../middlewares/validate.js";
import registerUserSchema from "../validations/registerUserSchema.js";
import loginUserSchema from "../validations/loginUserSchema.js";
import { asyncHandler } from "../helper.js";
import authenticate from "../middlewares/authenticate.js";
import updateProfileSchema from "../validations/updateProfileSchema.js";

const router = express.Router();

// User Registration
router.post('/register', validate(registerUserSchema), asyncHandler(register));

// User Login
router.post('/login', validate(loginUserSchema), asyncHandler(login));

router.put('/profile', authenticate, validate(updateProfileSchema), asyncHandler(updateProfile));

export default router;