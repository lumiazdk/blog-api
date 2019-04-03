const Client = require("mysql-pro");
const config = require('../config')
const Sequelize = require('sequelize');
const users = require('../modal/users.js')
const posts = require('../modal/posts.js')
const comments = require('../modal/comments.js')
const messages = require('../modal/messages.js')
const banners = require('../modal/banners.js')




const sequelize = new Sequelize('pc-blog', 'root', 'lumiazdk640', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
users(sequelize)
posts(sequelize)
comments(sequelize)
messages(sequelize)
banners(sequelize)




sequelize.sync()
sequelize
    .authenticate()
    .then(() => {
        console.log('数据库连接成功');
    })
    .catch(err => {
        console.error('数据库连接失败', err);
    });

module.exports = sequelize