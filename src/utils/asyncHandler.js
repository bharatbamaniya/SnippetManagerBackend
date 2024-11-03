import apiError from "./apiError.js";

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            console.error(err, err.message);
            return res.status(500).send(apiError(500, err.message));
        });
    };
};

export {asyncHandler};
