import jwt from 'jsonwebtoken';

export const genrateToken = (res, userId) => {
    const token = jwt.sign(
        {
            id : userId
        },
        process.env.JWT_SECRET,
        {expiresIn : '15d'}
    );

    res.cookie('jwt', token, {
        httpOnly : true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge : 30 * 24 *60 *60 * 100 // 30 days
    });
};
