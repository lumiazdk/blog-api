const Sequelize = require('sequelize');

module.exports = function posts(sequelize) {
    const Post = sequelize.define('Post', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        readNum: {
            type: Sequelize.STRING,
            allowNull: false
        },
        like: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        background: {
            type: Sequelize.JSON,
            allowNull: false
        },
        tag: {
            type: Sequelize.STRING,
            allowNull: false
        },
        introduction: {
            type: Sequelize.STRING,
            allowNull: false
        },

    }, {
        // options
    });
    return Post
}