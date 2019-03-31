const Router = require('koa-router');
const crypto = require('crypto')
const jwt = require('jwt-simple')
const uuid = require('uuid')
const captchapng = require('captchapng')
const router = new Router();
const fs = require('fs');
const path = require('path');
const sequelize = require('../libs/db');
const usersModal = require('../modal/users')(sequelize)
//秘钥
const jwtSecret = 'jwtSecret'
const tokenExpiresTime = 1000 * 60 * 60 * 24 * 7
//index.html
router.get('', (ctx) => {
    ctx.response.type = 'html'
    ctx.body = fs.readFileSync(path.join(__dirname, '../build/index.html'))
})
//上传
router.post('upload', (ctx) => {
    ctx.body = {
        "status": 1,
        "url": `http://${global.ip}:${global.port}/upload_${ctx.request.files[0].path.split('upload_').reverse()[0]}`
    }
})
//注册
router.post('register', async ctx => {

    let { phone, password, motto = '这个人很懒，什么都没留下' } = ctx.request.fields ? ctx.request.fields : {}
    const user_name = `用户${uuid.v1().split('-')[0]}`
    const photoPath = `http://${global.ip}:${global.port}/photo.jpeg`
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        phone: { type: "required", reg: /^1[34578]\d{9}$/, message: '手机号有误' },
        password: { type: "required" },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({ errors })
        return
    }
    //处理密码
    var md5 = crypto.createHash('md5').update(password, 'utf-8').digest('hex');
    let ishave = await usersModal.findAll({
        where: {
            phone: phone
        }
    })
    if (ishave.length > 0) {
        ctx.results.error('此用户已注册')
    } else {
        let newUser = await usersModal.create({ phone: phone, password: md5, motto: motto, name: user_name, photoPath: photoPath })
        let payload = {
            exp: Date.now() + tokenExpiresTime,
            phone: phone
        }
        let token = jwt.encode(payload, jwtSecret)
        let userInfo = JSON.parse(JSON.stringify(newUser))
        delete userInfo.password
        ctx.results.success({
            token, user: userInfo
        })
    }
});

//登陆
router.post('login', async ctx => {
    const { phone, password, captcha } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        phone: { type: "required", reg: /^1[34578]\d{9}$/, message: '手机号有误' },
        password: { type: "required" },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({ errors })
        return
    }
    //判断验证码
    if (0) {
        let cap = ctx.cookies.get('captcha')
        if (cap != captcha) {
            ctx.status = 401;
            ctx.body = {
                message: '验证码错误'
            }
            return
        }
    }
    //sql
    const ishave = await usersModal.findAll({
        where: {
            phone: phone
        }
    })
    if (ishave.length == 0) {
        ctx.results.error('暂无此用户！')
    } else {
        var md5 = crypto.createHash('md5').update(password, 'utf-8').digest('hex');

        if (ishave[0].password == md5) {
            let payload = {
                exp: Date.now() + tokenExpiresTime,
                phone: phone
            }
            let token = jwt.encode(payload, jwtSecret)
            let userInfo = JSON.parse(JSON.stringify(ishave[0]))
            delete userInfo.password
            ctx.results.success({
                token, user: userInfo
            })
        } else {
            ctx.results.error('密码错误！')
        }
    }
});
//用户列表
router.get('getUsers', async ctx => {
    let users = await usersModal.findAll();
    ctx.results.success({ data: users })
})
//图片验证码
router.post('getCaptchas', async ctx => {
    const cap = parseInt(Math.random() * 9000 + 1000);
    const p = new captchapng(80, 30, cap);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    const base64 = p.getBase64();
    ctx.cookies.set('captcha', cap, { maxAge: 360000, httpOnly: true });
    ctx.status = 200
    ctx.body = {
        code: 'data:image/png;base64,' + base64
    }
})








module.exports = router.routes();
