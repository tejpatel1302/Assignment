const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ServerConfig } = require('../../config');
const AppError = require('../../utils/errors/app-error');

// Create Access Token
function createToken(input) {
    try {
        return jwt.sign(input, ServerConfig.JWT_SECRET, {expiresIn: ServerConfig.JWT_EXPIRY});
    } catch(error) {
        console.log(error);
        throw error;
    }
}
function checkPassword(plainPassword, encryptedPassword) {
    try {
        return bcrypt.compareSync(plainPassword, encryptedPassword);
    } catch(error) {
        console.log(error);
        throw error;
    }
}
// Create Refresh Token
function createRefreshToken(payload) {
    try {
        return jwt.sign(payload, ServerConfig.REFRESH_TOKEN_SECRET, { expiresIn: ServerConfig.REFRESH_TOKEN_EXPIRY });
    } catch (error) {
        throw new AppError('Error generating refresh token', 500);
    }
}

// Verify Access Token with Error Handling
function verifyToken(token) {
    try {
        return jwt.verify(token, ServerConfig.JWT_SECRET);
    } catch(error) {
        console.log(error);
        throw error;
    }
}


// Verify Refresh Token with Error Handling
function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, ServerConfig.REFRESH_TOKEN_SECRET);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Token verification error:', error);

        if (error.name === 'TokenExpiredError') {
            throw new AppError('Refresh token expired', 401);
        } else if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid refresh token', 401);
        }
        throw new AppError('Error verifying refresh token', 500);
    }
}

module.exports = {
    createToken,
    createRefreshToken,
    verifyToken,
    verifyRefreshToken,
    checkPassword
};
