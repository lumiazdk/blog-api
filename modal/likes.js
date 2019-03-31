const Sequelize = require('sequelize');

module.exports = function likes(sequelize) {
    const Like = sequelize.define('Like', {
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lkUserId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    }, {
            // options
        });
    return Like
}

