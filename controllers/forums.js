const Forum = require('../models/forum')

const getPosts = (req, res) => {
    let forumId = req.params.forumId
    Forum.Forum.findById(forumId, (err, forum) => {
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
        Forum.Forum.findById(forumId, (err, forum) => {
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
                forum.answers = req.body.answers
                forum.answer = req.body.answer
                forum.save((err) => {
                    if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
                    return res.status(200).send({ forum: forum })
                })
            }
        })
    }
}

const addAnswer = (req, res) => {
    /* REQUIRED FIELDS ON REQUEST BODY
     *  postId: Post in which the answer is inserted
     *  answerBody: The content of the answer
     *  author: The answer's author
     *  date: date published
     *  likes: likes the answer has
     *  dislikes: dislikes the answer has
     * */

    let forumId = req.params.forumId
    let postId = req.body.postId

    Forum.Forum.findById(forumId, (err, forum) => {
        if (err) return res.status(500).send({ message: `Could not find forum: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum does not exist` })
        else {
            for (var i = 0; i < forum['posts'].length; i++) {
                if (forum['posts'][i]['_id'].toString() === postId) {
                    console.log('hola')
                    let answer = new Forum.Answer()
                    answer.answer = req.body.answer
                    answer.author = req.body.author
                    answer.date = req.body.date
                    answer.likes = req.body.likes
                    answer.dislikes = req.body.dislikes
                    forum['posts'][i]['answers'] = forum.posts.i.answers.concat(answer)
                    //forum.posts = forum['posts'].concat(post)
                }
            }
                /*
                Forum.Forum.find({ `posts.${i}._id`: ObjectId(postId) }, (err, posts) => {
                    if (err) return res.status(500).send({ message: `Could not find post: ${err}` })
                    if (!post) return res.status(404).send({ message: `Post does not exist` })
                   
                })
            }*/
            forum.save((err) => {
                if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
                return res.status(200).send({ forum: forum })
            })
        }
    })
}
module.exports = {
    getPosts,
    addPost,
    addAnswer
}
