export const globalErrHandler = (err,req,res,next) =>
{
    const stack = err?.stack;
    const message = err?.message;

    res.json(
        {
            stack,
            message,
        }
    );
}