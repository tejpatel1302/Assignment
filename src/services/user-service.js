const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Auth, Enums } = require('../utils/common');
const { User } = require('../models')
const userRepo = new UserRepository();

async function create(data) {
    try {
        const user = await userRepo.create(data);
        
        return user;
    } catch (error) {
        console.log(JSON.stringify(error, null, 2)); // Log the full error object for debugging.
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepo.getUserByEmail(data.email);
        if (!user) {
            throw new AppError('No user found for the given email', StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.checkPassword(data.password, user.password);
        if (!passwordMatch) {
            throw new AppError('Invalid password', StatusCodes.BAD_REQUEST);
        }

        const accessToken = Auth.createToken({ id: user.id, email: user.email });
        const refreshToken = Auth.createRefreshToken({ id: user.id, email: user.email });

        // Optionally store the refresh token in the database for further verification.
        await userRepo.saveRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token) {
    
    try {
        if(!token) {
            throw new AppError('Missing JWT token', StatusCodes.BAD_REQUEST);
        }
        const response = Auth.verifyToken(token);
        console.log(response.id,'abc')
        const user = await userRepo.get(response.id);
        console.log(user.id,'abc2')
        if(!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        return user.id;
    } catch(error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError') {
            throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
        }
        if(error.name == 'TokenExpiredError') {
            throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function refreshTokens(refreshToken) {
    try {
        if (!refreshToken) {
            throw new AppError('Missing refresh token', StatusCodes.BAD_REQUEST);
        }

        // Verify the refresh token
        const payload = Auth.verifyRefreshToken(refreshToken);

        // Optionally check if the refresh token exists in the database (blacklist check)
        const user = await userRepo.get(payload.id);
        if (!user) {
            throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
        }

        // Generate a new access token
        const newAccessToken = Auth.createAccessToken({ id: user.id, email: user.email });

        // Optionally, generate a new refresh token
        const newRefreshToken = Auth.createRefreshToken({ id: user.id, email: user.email });
        await userRepo.saveRefreshToken(user.id, newRefreshToken); // Replace old refresh token

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid refresh token', StatusCodes.BAD_REQUEST);
        }
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Refresh token expired', StatusCodes.BAD_REQUEST);
        }
        console.log(error);
        throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function logout(userId) {
    try {
        const user = await userRepo.get(userId);
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }

        // Remove or invalidate the refresh token from the database
        await userRepo.removeRefreshToken(userId);

        return { message: 'Logged out successfully' };
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.log(error);
        throw new AppError('Error logging out', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// async function addRoletoUser(data) {
//     try {
//         const user = await userRepo.get(data.id);
//         if(!user) {
//             throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
//         }
//         const role = await roleRepo.getRoleByName(data.role);
//         if(!role) {
//             throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
//         }
//         user.addRole(role);
//         return user;
//     } catch(error) {
//         if(error instanceof AppError) throw error;
//         console.log(error);
//         throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// }

// async function isAdmin(id) {
//     try {
//         const user = await userRepo.get(id);
//         if(!user) {
//             throw new AppError('No user found for the given id', StatusCodes.NOT_FOUND);
//         }
//         const adminrole = await roleRepo.getRoleByName(Enums.USER_ROLES_ENUMS.ADMIN);
//         if(!adminrole) {
//             throw new AppError('No user found for the given role', StatusCodes.NOT_FOUND);
//         }
//         return user.hasRole(adminrole);
//     } catch(error) {
//         if(error instanceof AppError) throw error;
//         console.log(error);
//         throw new AppError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
//     }
// }
async function getAllUsers(req, res) {
    return await User.findAll({ where: { deletedAt: null } }); // Fetch only non-deleted users
};

async function updateUser(req, res) {
    const user = await User.findByPk(userId);
    if (user) {
        return await user.update(userData); // Update the user with new data
    }
    return null;
};

async function deleteUser(req, res) {
    const user = await User.findByPk(userId);
    if (user) {
        return await user.update({ deletedAt: new Date() }); // Soft delete by setting deletedAt
    }
    return null;
};
async function getAllUsers() {
    try {
        const users = await User.findAll({ where: { deletedAt: null } });
        
        // Count the total number of non-deleted users
        const totalUsers = await User.count({ where: { deletedAt: null } });
        
        if (!users || users.length === 0) {
            throw new AppError('No users found', StatusCodes.NOT_FOUND);
        }

        // Return both the user list and total count
        return {
            totalUsers,
            users,
        };
    } catch (error) {
        console.error('Detailed error fetching users:', error); // More detailed log
        throw new AppError('Error fetching users', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



async function updateUser(userId, userData) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            return await user.update(userData);
        }
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
    } catch (error) {
        throw new AppError('Error updating user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function deleteUser(userId) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            return await user.update({ deletedAt: new Date() });
        }
        throw new AppError('User not found', StatusCodes.NOT_FOUND);
    } catch (error) {
        throw new AppError('Error deleting user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    create,
    signin,
    isAuthenticated,
    
    
    deleteUser,
    updateUser,
    getAllUsers,
    refreshTokens,
    logout

}