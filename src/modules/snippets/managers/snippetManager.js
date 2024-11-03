import snippetService from "../services/snippetService.js";
import apiResponse from "../../../utils/apiResponse.js";
import apiError from "../../../utils/apiError.js";

const add = async (title, description, code, isFavorite, loggedInUser) => {
    const snippet = await snippetService.addSnippet(
        title,
        description,
        code,
        isFavorite,
        loggedInUser,
    );

    if (snippet) return apiResponse(200, snippet, "Snippet created.");

    return apiError(500, "Snippet not created.");
};

const getAll = async () => {
    const roles = await snippetService.getAllSnippets();

    if (roles.length) return apiResponse(200, roles, "Snippets retrieved successfully.");

    return apiError(200, "Snippets not found");
};

const updateById = async (roleId, roleName, description, loggedInUser) => {
    const response = await snippetService.updateSnippetById(roleId, roleName, description, loggedInUser);

    if (response.isUpdated) return apiResponse(200, null, "Snippet updated successfully.");

    return apiResponse(200, "Snippet not updated.");
};

const deleteById = async (id) => {
    const response = await snippetService.deleteSnippetById(id);

    if (response.isDeleted && response.isPermanent) return apiResponse(200, null, "The snippet details has been purged from the database.");
    if (response.isDeleted && !response.isPermanent) return apiResponse(200, null, "The snippet details have been moved to the trash.");

    return apiResponse(400, null, "Snippet not found");
};

export default {add, getAll, updateById, deleteById};
