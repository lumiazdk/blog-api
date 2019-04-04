const Router = require('koa-router');
const router = new Router();
const sequelize = require('../libs/db');
const messagesModal = require('../modal/messages')(sequelize)

//留言
router.post('addMessage', async ctx => {
    let {
        name,
        message,
        email
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        name: {
            type: "required"
        },
        message: {
            type: "required"
        },
        email: {
            type: "required"
        },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({
            errors
        })
        return
    }
    await messagesModal.create({
        name: name,
        message: message,
        email: email

    })

    ctx.results.success({

    })
});
router.post('getMessage', async ctx => {
    let {
        where,
        page
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        where: {
            type: "required"
        },
        page: {
            type: "required"
        },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({
            errors
        })
        return
    }
    let posts = await messagesModal.findAndCountAll({
        offset: (page - 1) * 5,
        limit: 5,
        where: where
    })
    ctx.results.success({
        data: posts
    })
});
router.post('delMessage', async ctx => {
    let {
        id
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        id: {
            type: "required"
        },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({
            errors
        })
        return
    }
    let posts = await messagesModal.destroy({
        where: {
            id: id
        }
    })
    ctx.results.success({})
});
module.exports = router.routes();