const Sequelize = require('sequelize');

module.exports = function banners(sequelize) {
    const Banner = sequelize.define('Banner', {
        bannerPath: {
            type: Sequelize.JSON,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        // options
    });
    return Banner
}