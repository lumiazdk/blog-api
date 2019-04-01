const Sequelize = require('sequelize');

module.exports = function comments(sequelize) {
    const Comment = sequelize.define('Comment', {
        postId: {
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