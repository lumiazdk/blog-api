const Router = require('koa-router');
const router = new Router();
const sequelize = require('../libs/db');
const postsModal = require('../modal/posts')(sequelize)
//添加博客
router.post('addPost', async ctx => {
    let { title, userId, content, readNum = 0, type, tag, background, like = 0 } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        title: { type: "required" },
        userId: { type: "required" },
        content: { type: "required" },
        readNum: { type: "required" },
        type: { type: "required" },
        tag: { type: "required" },
        background: { type: "required" },
        like: { type: "required" },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({ errors })
        return
    }
    await postsModal.create({ title: title, content: content, readNum: readNum, type: type, tag: tag, background: background, like: like })
    ctx.results.success({
    })
});
//获取博文
router.post('getPost', async ctx => {
    let { where } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        where: { type: "required" },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({ errors })
        return
    }
    let posts = await postsModal.findAll({
        where: where
    })
    ctx.results.success({
        data: posts
    })
});
//编辑博文
router.post('editPost', async ctx => {
    let { id, where } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        id: { type: "required" },
        where: { type: "required" },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({ errors })
        return
    }
    let posts = await postsModal.update({ id: id }, {
        where: where
    })
    ctx.results.success({

    })
});
//删除博文
router.post('delPost', async ctx => {
    let { id } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        id: { type: "required" },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({ errors })
        return
    }
    let posts = await postsModal.destroy({
        where: {
            id: id
        }
    })
    ctx.results.success({
    })
});
//点赞
router.post('addLikes', async ctx => {
    let { id } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        id: { type: "required" },
    }
    let errors = ctx.json_schema(body, schema)
    if (errors) {
        ctx.results.jsonErrors({ errors })
        return
    }
    let nowPost = await postsModal.findAll({
        where: {
            id: id
        }
    })
    nowPost = nowPost.toJSON()
    await postsModal.update({ id: id }, {
        where: {
            id: id,
            like: nowPost.like + 1
        }
    })
    ctx.results.success({
    })
});
module.exports = router.routes();
