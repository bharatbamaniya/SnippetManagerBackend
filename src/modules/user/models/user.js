import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import {generateToken} from "../../../utils/jwtService.js";


const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    {timestamps: true}
);

userSchema.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJwtToken = function () {
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname,
    };

    return generateToken(payload);
};

userSchema.methods.getUserWithoutSensitiveData = function () {
    const object = this.toObject();
    delete object.password;

    return object;
};

const User = mongoose.model("User", userSchema);

export default User;
