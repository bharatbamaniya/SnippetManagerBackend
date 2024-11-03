import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: String,
        isFavorite: Boolean,
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        createdBy: String,
        updatedBy: String,
    },
    {timestamps: true}
);

snippetSchema.set("toJSON", {
    getters: true,
    virtuals: false,
    transform: function (doc, ret) {
        const id = ret._id;
        delete ret._id;
        delete ret.isDeleted;
        delete ret.deletedAt;
        return {id, ...ret};
    },
});

snippetSchema.set("toObject", {
    getters: true,
    virtuals: false,
    transform: function (doc, ret) {
        const id = ret._id;
        delete ret._id;
        return {id, ...ret};
    },
});

const snippetModel = mongoose.model("snippet", snippetSchema);
export default snippetModel;
