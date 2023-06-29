import User from "../model/User.js"

const isAdmin = async (req , res , next) =>
{
    //Find login
    const user = await User.findById(req.userAuthId);

    if(user?.isAdmin)
    {
        next();
    }
    else
    {
        next(new Error("Access denied ! Admin only."));
    }
}

export default isAdmin;