const { StatusCodes } = require('http-status-codes');

const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse, Auth } = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const { UserRepository } = require('../repositories');
const userRepo = new UserRepository();


/**
 * POST : /signup 
 * req-body {email: 'a@b.com', password: '1234'}
 */
async function signup(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password,  // Ensure password is properly hashed if necessary
            name: req.body.name,
            role: req.body.role || 'user',
            status: req.body.status || 'active',
            // commissionRate: req.body.commissionRate || 20.00
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await UserService.getAllUsers();
        res.status(StatusCodes.OK).json(users);
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;
    try {
        const updatedUser = await UserService.updateUser(id, userData);
        if (updatedUser) {
            res.status(StatusCodes.OK).json(updatedUser);
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const deletedUser = await UserService.deleteUser(id);
        if (deletedUser) {
            res.status(StatusCodes.OK).json({ message: 'User soft deleted successfully' });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}
async function logout(req, res, next) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Refresh token is required', StatusCodes.BAD_REQUEST));
    }

    let payload;
    try {
        payload = Auth.verifyRefreshToken(refreshToken);
    } catch (err) {
        return next(new AppError('Invalid or expired refresh token', StatusCodes.UNAUTHORIZED));
    }

    try {
        const user = await userRepo.get(payload.id);
        if (!user) {
            return next(new AppError('User not found', StatusCodes.NOT_FOUND));
        }

        // Log both tokens for debugging
        console.log(`Received refresh token: ${refreshToken}`);
        console.log(`Stored refresh token: ${user.refreshToken}`);

        if (user.refreshToken !== refreshToken) {
            return next(new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED));
        }

        await userRepo.saveRefreshToken(user.id, null);

        return res.status(StatusCodes.OK).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.explanation });
        }
        return next(new AppError('An unexpected error occurred', StatusCodes.INTERNAL_SERVER_ERROR));
    }
}







async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', StatusCodes.BAD_REQUEST);
        }

        // Verify the refresh token
        const payload = Auth.verifyRefreshToken(refreshToken);

        // Fetch the user from the database using the id from the payload
        const user = await userRepo.get(payload.id); // Call the method on the instance
        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
        }

        // Generate a new access token
        const newAccessToken = Auth.createToken({ id: user.id, email: user.email });

        // Generate a new refresh token (Token rotation)
        const newRefreshToken = Auth.createRefreshToken({ id: user.id, email: user.email });

        // Save the new refresh token in the database (rotate the token)
        await userRepo.saveRefreshToken(user.id, newRefreshToken);

        return res.status(StatusCodes.OK).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.error("Error refreshing token: ", error);
        next(error); // Handle errors centrally
    }
}




module.exports = {
    signup,
    signin,
    addRoleToUser,
    deleteUser,
    updateUser,
    getAllUsers,
    logout,
    refreshToken
}