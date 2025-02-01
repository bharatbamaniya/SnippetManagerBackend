import bcrypt from "bcrypt";
import User from "../models/user.js";

const hashPasswordPassword = function (password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

export const createUser = async function (email, password) {
    password = await hashPasswordPassword(password);
    return User.create({ email, password });
};

export const findUserByEmail = function (email) {
    return User.findOne({ email });
};
