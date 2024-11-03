import Snippet from "../models/snippetModel.js";

const addSnippet = async (title, description, code, isFavorite, loggedInUser) => {
    try {
        const snippet = await Snippet.create({
            title,
            description,
            code,
            isFavorite,
            createdBy: loggedInUser,
            updatedBy: loggedInUser,
        }, null);

        if (snippet) return snippet;

        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

const isSnippetExist = async (id) => {
    try {
        return Snippet.exists({_id: id});
    } catch (e) {
        console.error(e);
        return false;
    }
};

const getAllSnippets = async () => {
    try {
        const snippets = await Snippet.find({isDeleted: false}, null, null).sort({createdAt: -1});

        if (snippets.length) return snippets;

        return [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

const updateSnippetById = async (id, title, description, code, isFavorite, loggedInUser) => {
    const query = {};

    if (title.trim()) query["name"] = title;
    if (description.trim()) query["description"] = description;
    if (code) query["code"] = code;
    query["_id"] = id;
    query["isFavorite"] = !!isFavorite;
    query["updatedBy"] = loggedInUser;

    try {
        const role = await Snippet.updateOne({_id: id}, query);

        if (role['matchedCount'] && role['modifiedCount']) {
            return {isUpdated: true};
        } else {
            return {isUpdated: false};
        }
    } catch (e) {
        console.error(e);
        return {isUpdated: false};
    }
};

async function deleteSnippet(id) {
    const result = await Snippet.findById(id, null, null);

    if (result) {
        if (result['isDeleted']) {
            const res = await Snippet.deleteOne({_id: id});
            return {deletedCount: res['deletedCount'], deletedStatus: "permanent"};
        } else {
            const res = await Snippet.updateOne({_id: id}, {isDeleted: true});
            return {deletedCount: res['modifiedCount'], deletedStatus: "softDelete"};
        }
    }
}

/**
 * @param id
 * @returns {Promise<{isPermanent: boolean, isDeleted: boolean}>}
 */
const deleteSnippetById = async (id) => {
    try {
        const result = await deleteSnippet(id);

        if (result && result.deletedCount && result.deletedStatus === "permanent") {
            return {isDeleted: true, isPermanent: true};
        } else if (result && result.deletedCount && result.deletedStatus === "softDelete") {
            return {isDeleted: true, isPermanent: false};
        } else {
            return {isDeleted: false, isPermanent: false};
        }
    } catch (e) {
        console.error(e);
        return {isDeleted: false, isPermanent: false};
    }
};

export default {addSnippet, getAllSnippets, isSnippetExist, updateSnippetById, deleteSnippetById};
