const Forum = require('../models/forum')

const createForum = (req, res) => {
    let forum = new Forum()
    forum.groupName = req.body.groupName
    forum.posts.title = req.body.posts.title
    forum.posts.date = req.body.posts.date
    forum.posts.author = req.body.posts.author
    forum.posts.likes = req.body.posts.likes
    forum.posts.dislikes = req.body.posts.dislikes
    forum.posts.userFavs = req.body.posts.userFavs
    forum.posts.comments.author = req.body.posts.comments.author
    forum.posts.comments.date = req.body.posts.comments.date
    forum.posts.comments.comment = req.body.posts.comments.comment
    forum.posts.comments.likes = req.body.posts.comments.likes
    forum.posts.comments.dislikes = req.body.posts.comments.dislikes
    forum.save((err) => {
        if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
        return res.status(200).send({ forum: forum })
    })
}

const getForums = (req, res) => {
    Forum.find(function (err, forums) {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forums) return res.status(404).send({ message: `The forum doesn't exist: ${err}` })

        res.status(200).send(forums)
    })
}

module.exports = {
    createForum,
    getForums
}
