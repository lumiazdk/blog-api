const Router = require('koa-router');
const router = new Router();
const sequelize = require('../libs/db');
const postsModal = require('../modal/posts')(sequelize)
const commentsModal = require('../modal/comments')(sequelize)

//添加博客
router.post('addPost', async ctx => {
    let {
        title,
        userId,
        content,
        readNum = 0,
        type,
        tag,
        background,
        like = 0
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        title: {
            type: "required"
        },
        userId: {
            type: "required"
        },
        content: {
            type: "required"
        },
        readNum: {
            type: "required"
        },
        type: {
            type: "required"
        },
        tag: {
            type: "required"
        },
        background: {
            type: "required"
        },
        like: {
            type: "required"
        },
    }
    if (background) {
        background = `http://${global.ip}:${global.port}/upload_${ctx.request.files[0].path.split('upload_').reverse()[0]}`
    }
    let errors = ctx.json_schema(body, schema)
    console.log(errors)
    if (errors) {
        ctx.results.jsonErrors({
            errors
        })
        return
    }
    await postsModal.create({
        title: title,
        content: content,
        userId: userId,
        readNum: readNum,
        type: type,
        tag: tag,
        background: background,
        like: like
    })
    ctx.results.success({})
});
//获取博文
router.post('getPost', async ctx => {
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
    let posts = await postsModal.findAndCountAll({
        offset: (page - 1) * 5,
        limit: 5,
        where: where
    })
    ctx.results.success({
        data: posts
    })
});
//编辑博文
router.post('editPost', async ctx => {
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
    let posts = await postsModal.update(where, {
        where: {
            id: id
        }
    })
    ctx.results.success({

    })
});
//删除博文
router.post('delPost', async ctx => {
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
    let posts = await postsModal.destroy({
        where: {
            id: id
        }
    })
    ctx.results.success({})
});
//点赞
router.post('addLikes', async ctx => {
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
    let nowPost = await postsModal.findAll({
        where: {
            id: id
        }
    })
    let like = nowPost[0].like + 1
    await postsModal.update({
        like: like
    }, {
        where: {
            id: id,
        }
    })
    ctx.results.success({
        like: like
    })
});
//阅读量
router.post('addReadNum', async ctx => {
    //随机数
    function sum(m, n) {
        var num = Math.floor(Math.random() * (m - n) + n);
        return num
    }
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
    let nowPost = await postsModal.findAll({
        where: {
            id: id
        }
    })
    let readNum = parseInt(nowPost[0].readNum) + sum(1, 100)
    let data = await postsModal.update({
        readNum: readNum
    }, {
        where: {
            id: id,
        }
    })
    ctx.results.success({
        readNum: readNum
    })
});
//评论
router.post('postComment', async ctx => {
    let {
        postId,
        comment
    } = ctx.request.fields ? ctx.request.fields : {}
    let body = ctx.request.fields ? ctx.request.fields : {}
    let schema = {
        postId: {
            type: "required"
        },
        comment: {
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
    await commentsModal.create({
        postId: postId,
        comment: comment
    })

    ctx.results.success({

    })
});
module.exports = router.routes();