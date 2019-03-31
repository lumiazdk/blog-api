const Sequelize = require('sequelize');

module.exports = function users(sequelize) {
    const User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        photoPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        motto: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
            // options
        });
    return User
}

