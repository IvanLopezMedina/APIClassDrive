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
/**
 * Required fields on request body:
 * @property {object} forum.posts                   - post documents to add
 * @property {string} forum.posts.title             - title of post
 * @property {date} forum.posts.date                - date of post
 * @property {string} forum.posts.author            - author of post
 * @property {int} forum.posts.likes                - count of likes
 * @property {int} forum.posts.dislikes             - count of dislikes
 * @property {array} forum.posts.userFavs           - array of users IDs
 * @property {object} forum.posts.answers           - answer documents
 * @property {string} forum.posts.answers.answer    - answer content
 * 
 * @param {*} req - request of function
 * @param {*} res - response of function
 */
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
/*
const addAnswer = (req, res) => {
    /* REQUIRED FIELDS ON REQUEST BODY
     *  postId: Post in which the answer is inserted
     *  answer: The content of the answer
     *  author: The answer's author
     *  date: date published
     *  likes: likes the answer has
     *  dislikes: dislikes the answer has
     * */
/*
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
                }
            }
            forum.save((err) => {
                if (err) return res.status(500).send({ msg: `Error al crear forum: ${err}` })
                return res.status(200).send({ forum: forum })
            })
        }
    })
}
*/

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
module.exports = {
    getPosts,
    addPost
    // addAnswer
}
