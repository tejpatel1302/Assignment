const { Sequelize } = require("sequelize");

const connection = async () =>{
    const sequelize = new Sequelize('User', 'postgres', '234@123', {
        host: 'localhost',
        dialect: 'postgres'
      });
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = connection;