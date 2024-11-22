import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d", // Token validity for 15 days
    });

    // Set the token as an HTTP-only cookie
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // Helps mitigate XSS attacks
        sameSite: "strict", // Protect against CSRF attacks
    });

    return token; // Explicitly return the token
};

export default generateTokenAndSetCookie;
