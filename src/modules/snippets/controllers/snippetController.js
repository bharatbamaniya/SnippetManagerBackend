import snippetManager from "../managers/snippetManager.js";
import apiResponse from "../../../utils/apiResponse.js";
import {asyncHandler} from "../../../utils/asyncHandler.js";

const add = asyncHandler(async (req, res) => {
    const {title, description, code, isFavorite} = req.body;
    const loggedInUser = req.userId;

    if (!title || !title.trim()) {
        return res.status(400).send(apiResponse(400, null, "Title can not be blank!"));
    }

    const result = await snippetManager.add(title, description, code, isFavorite, loggedInUser);
    return res.status(result.statusCode).send(result);
});

const getAll = asyncHandler(async (req, res) => {
    const response = await snippetManager.getAll();
    return res.status(response.statusCode).send(response);
});

const updateById = asyncHandler(async (req, res) => {
    const roleId = req.params.id;
    const roleName = req.body.name;
    const description = req.body.description;
    const loggedInUser = req.userId;

    if (!roleId || !roleId.trim()) {
        return res.status(400).send(apiResponse(400, null, "RoleId can not be blank!"));
    }

    if (!roleName || !description) {
        return res.status(400).send(apiResponse(400, null, "Name or description can not be blank!"));
    }

    const response = await snippetManager.updateById(roleId, roleName, description, loggedInUser);
    return res.status(response.statusCode).send(response);
});

const deleteById = asyncHandler(async (req, res) => {
    const roleId = req.params.id;

    const response = await snippetManager.deleteById(roleId);
    return res.status(response.statusCode).send(response);
});

export default {add, getAll, updateById, deleteById};
