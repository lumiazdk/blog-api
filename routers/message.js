const Router = require('koa-router');
const router = new Router();
const sequelize = require('../libs/db');
const messagesModal = require('../modal/messages')(sequelize)

//留言
router.post('addMessage', async ctx => {
    let {
        name,
        message
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        name: {
            type: "required"
        },
        message: {
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
        message: message
    })

    ctx.results.success({

    })
});
module.exports = router.routes();