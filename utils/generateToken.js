import jwt from 'jsonwebtoken';

const generateToken = () =>
{
    return jwt.sign({id},process.env.JWT_KEY,{expiresIn : "3d"});
};

export default generateToken;