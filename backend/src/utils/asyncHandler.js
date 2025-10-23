const asyncHandler = (requestionsHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestionsHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}