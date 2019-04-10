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

const getPost = (req, res) => {
    let forumId = req.body.forumId
    let postId = req.params.postId
    Forum.Forum.findById(forumId, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum doesn't exist` })
        for (var i = 0; i < forum['posts'].length; i++) {
            if (forum['posts'][i]['_id'].toString() === postId) {
                let post = forum['posts'][i]
                res.status(200).send({ post })
            }
        }
    })
}

const addPost = (req, res) => {
    var valid = validPost(req, res)
    if (valid[1]) {
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
                    if (err) return res.status(500).send({ msg: `Error creating forum: ${err}` })
                    return res.status(200).send({ forum: forum })
                })
            }
        })
    } else {
        return res.status(500).send({ message: valid[0] })
    }
}

const addAnswer = (req, res) => {
    /* REQUIRED FIELDS ON REQUEST BODY
     *  postId: Post in which the answer is inserted
     *  answer: The content of the answer
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
                    for (var j = 0; j < req.body.answers.length; j++) {
                        let answer = new Forum.Answer()
                        answer.answer = req.body.answers[j]['answer']
                        answer.author = req.body.answers[j]['author']
                        answer.date = req.body.answers[j]['date']
                        answer.likes = req.body.answers[j]['likes']
                        answer.dislikes = req.body.answers[j]['dislikes']
                        forum['posts'][i]['answers'].push(answer)
                    }
                }
            }
            forum.save((err) => {
                if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
                return res.status(200).send({ forum: forum })
            })
        }
    })
}

const updateForum = (req, res) => {
    let forumId = req.params.forumId
    Forum.Forum.findById(forumId, (err, forum) => {
        if (err) return res.status(500).send({ message: `Could not find forum: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum does not exist` })
        else {
            forum.posts = req.body.posts
            forum.title = req.body.title
            forum.date = req.body.date
            forum.author = req.body.author
            forum.likes = req.body.likes
            forum.dislikes = req.body.dislikes
            forum.userFavs = req.body.userfavs
            forum.answers = req.body.answers
            forum.answer = req.body.answer
            forum.save((err) => {
                if (err) return res.status(500).send({ msg: `Error creating forum: ${err}` })
                return res.status(200).send({ forum: forum })
            })
        }
    })
}

const validPost = function (req, res) {
    let posts = req.body.posts
    if (posts == null || posts === '' || posts.length === 0) return [`Error post is empty`, false]
    for (var i = 0; i < posts.length; i++) {
        let title = posts[i]['title']
        let author = posts[i]['author']
        if (title == null || title === '') return [`Error title is empty`, false]
        else if (author == null || author === '') return [`Error author is empty`, false]
    }

    return ['', true]
}

const deleteForumElement = function (req, res) {
    /*
     REQUIRED FIELDS ON REQUEST BODY:
        idToDelete: Id of the forum element you want to delete
     
     */
    let forumId = req.params.forumId
    let elementToDelete = req.body.idToDelete
    // Se if element is a post or an answer
    Forum.Forum.findById(forumId, (err, forum) => {
        if (err) return res.status(500).send({ message: `Could not find forum: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum does not exist` })
        else {
            for (var i = 0; i < forum['posts'].length; i++) {
                if (forum['posts'][i]['_id'].toString() === idToDelete) {
                    forum['posts'].splice(i, 1)
                    return res.status(200).send({ message: 'Post Deleted successfully' })
                    forum.save((err) => {
                        if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
                        return res.status(200).send({ forum: forum })
                    })
                }
                else {
                    for (var j = 0; j < req.body.answers.length; j++) {
                        if (forum['posts'][i]['answers'][j]['_id'].toString() === idToDelete) {
                            forum['posts'][i]['answers'].splice(j, 1)
                            return res.status(200).send({ message: 'Answer Deleted successfully' })
                            forum.save((err) => {
                                if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
                                return res.status(200).send({ forum: forum })
                            })
                        }
                    }
                }
            }
            return res.status(500)
        }
    })
}


module.exports = {
    getPosts,
    getPost,
    addPost,
    updateForum
    deleteForumElement
}
