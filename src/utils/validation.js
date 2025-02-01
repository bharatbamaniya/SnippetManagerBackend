import validator from "validator";

export const validateSignUpData = (requestBody) => {
    const {email, password} = requestBody;

    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    if (!validator.isEmail(email)) throw new Error("Email address is not valid");
    if (!validator.isStrongPassword(password)) throw new Error("Please enter a strong password");
};

export const validateLoginData = (requestBody) => {
    const {email, password} = requestBody;

    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");

    if (!validator.isEmail(email)) throw new Error("Email address is not valid");
};
