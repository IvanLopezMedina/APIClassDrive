const Forum = require('../models/forum')
/*
const createForum = (req, res) => {
    let forum = new Forum()
    forum.groupName = req.body.groupname
    forum.posts = req.body.posts
    forum.title = req.body.title
    forum.date = req.body.date
    forum.author = req.body.author
    forum.likes = req.body.likes
    forum.dislikes = req.body.dislikes
    forum.userFavs = req.body.userfavs
    forum.comments = req.body.comments
    forum.comment = req.body.comment

    console.log(req.body)
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
*/

const getPosts = (req, res) => {
    let forumId = req.params.forumId
    Forum.findById(forumId, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum doesn't exist` })
        var posts = forum[ 'posts' ]
        res.status(200).send({ posts })
    })
}

const addPost = (req, res) => {
    if (req.body.posts == null) return res.status(500).send({ message: `Error post empty` })
    else {
        let forumId = req.params.forumId
        Forum.findById(forumId, (err, forum) => {
            if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
            if (!forum) return res.status(404).send({ message: `Forum doesn't exist` })
            else {
                forum.posts = forum['posts'].concat(req.body.posts)
                forum.title = req.body.title
                forum.date = req.body.date
                forum.author = req.body.author
                forum.likes = req.body.likes
                forum.dislikes = req.body.dislikes
                forum.userFavs = req.body.userfavs
                forum.comments = req.body.comments
                forum.comment = req.body.comment
                forum.save((err) => {
                    if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
                    return res.status(200).send({ forum: forum })
                })
            }
        })
    }
}
module.exports = {
    getPosts,
    addPost
    // getForums
}
