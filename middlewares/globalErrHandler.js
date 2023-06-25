export const globalErrHandler = (err,req,res,next) =>
{
    const stack = err?.stack;
    const message = err?.message;
    const statusCode = err?.statusCode ? err?.statusCode:500;

    res.status(statusCode).json({stack,message});
}

// 404  Handler

export const notFound = (req,res,next) => 
{
    const err = new Error(`Page ${req.originalUrl} not found`);
    next(err);
};