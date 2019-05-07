const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const QuestionsSchema = new Schema({
    question: [String],
    answer: [String],
    correctAnswer: [Number],
    versionKey: false
},
{
    versionKey: false
})
const Questions = mongoose.model('questions', QuestionsSchema)

const TestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    groupName: {
        type: String
    },
    questions: [QuestionsSchema],
    user: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
},
{
    versionKey: false
})

const Test = mongoose.model('test', TestSchema)

module.exports = {
    Test,
    Questions
}