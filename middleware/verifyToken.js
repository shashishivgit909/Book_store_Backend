import jwt from "jsonwebtoken";

export const verifyToken =  (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    // console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }
    jwt.verify(token,process.env.JWTSECRET||"SHASHI", (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid credientials' });
        }
        req.user = user;
        next();
    })

}