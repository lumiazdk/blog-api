const Sequelize = require('sequelize');

module.exports = function comments(sequelize) {
    const Comment = sequelize.define('Comment', {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ctUserId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
            // options
        });
    return Comment
}

