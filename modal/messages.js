const Sequelize = require('sequelize');

module.exports = function Message(sequelize) {
    const Message = sequelize.define('Message', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        message: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        // options
    });
    return Message
}