const Router = require('koa-router');
const router = new Router();
const sequelize = require('../libs/db');
const bannersModal = require('../modal/banners')(sequelize)

//创建banner
router.post('addBanner', async ctx => {
    let {
        bannerPath,
        name
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        bannerPath: {
            type: "required"
        },
        name: {
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
    await bannersModal.create({
        name: name,
        bannerPath: bannerPath
    })

    ctx.results.success({

    })
});
router.post('editBanner', async ctx => {
    let {
        id,
        where
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        id: {
            type: "required"
        },
        where: {
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
    await bannersModal.update(where, {
        where: {
            id: id
        }
    })

    ctx.results.success({

    })
});
//获取
router.post('getBanner', async ctx => {
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
    let posts = await bannersModal.findAndCountAll({
        offset: (page - 1) * 5,
        limit: 5,
        where: where
    })
    ctx.results.success({
        data: posts
    })
});
router.post('delBanner', async ctx => {
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
    let posts = await bannersModal.destroy({
        where: {
            id: id
        }
    })
    ctx.results.success({})
});
module.exports = router.routes();