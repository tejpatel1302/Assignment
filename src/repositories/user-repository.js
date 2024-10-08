const CrudRepository = require('./crud-repository');
const { User } = require('../models');

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }
    async saveRefreshToken(userId, refreshToken) {
        const user = await this.get(userId); // This should call the get method from CrudRepository
        if (user) {
            user.refreshToken = refreshToken;
            await user.save();
        }
    }

    async removeRefreshToken(userId) {
        const user = await User.findByPk(userId);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
    }
    
    async getUserByRefreshToken(refreshToken) {
        return await User.findOne({ where: { refreshToken } });
    }
    async getUserByEmail(email) {
        const user = await User.findOne({ where: { email: email } });
        return user;
    }
}

module.exports = UserRepository;
