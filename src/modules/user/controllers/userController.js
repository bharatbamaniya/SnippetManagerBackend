import { createUser, findUserByEmail } from "../services/userService.js";
import {asyncHandler} from "../../../utils/asyncHandler.js";
import {validateLoginData, validateSignUpData} from "../../../utils/validation.js";

export const register = asyncHandler(async (req, res) => {
    validateSignUpData(req.body);
    const { email, password } = req.body;

    const isUserExitWithEmail = await findUserByEmail(email);

    if (isUserExitWithEmail) throw new Error("User already exist with email.");

    const createdUser = await createUser(email, password);
    const userData = createdUser.getUserWithoutSensitiveData();

    return res.status(201).json({message: "User registered successfully", data: userData});
});

export const login = asyncHandler(async (req, res) => {
    validateLoginData(req.body);
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = user.generateJwtToken();

    return res.json({data: { token }, message: "Logged in successfully"});
});
