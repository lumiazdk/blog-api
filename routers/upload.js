const Router = require('koa-router');
const router = new Router();
const sequelize = require('../libs/db');

//上传
router.post('upload', (ctx) => {
    ctx.body = {
        "status": 1,
        "url": `http://${global.ip}:${global.port}/upload_${ctx.request.files[0].path.split('upload_').reverse()[0]}`
    }
})
module.exports = router.routes();