const apiResponse = (statusCode, data, message = "Success") => ({
    statusCode,
    data,
    message,
    success: statusCode < 400,

    toString: () => (statusCode < 400 ? `API Success: ${message}` : `API Error: ${message}, Status: ${statusCode}`),
});

export default apiResponse;
