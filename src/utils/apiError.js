const apiError = (statusCode, message = "Something went wrong", errors = []) => ({
    // Inherit default message and success property
    message,
    success: false,

    // Assign other properties
    statusCode,
    data: null,
    errors,

    // Define toString method for error representation
    toString: () => `API Error: ${message}, Status: ${statusCode}`,
});

export default apiError;
