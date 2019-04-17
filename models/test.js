const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionsSchema = new Schema({
    question: String,
    answer: [String],
    correctAnswer: [String],
    versionKey: false
},
{
    versionKey: false
})
const Questions = mongoose.model('questions', QuestionsSchema)

const TestSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true },
    groupName: {
        type: String
    },
    questions: [QuestionsSchema]
},
{
    versionKey: false
})

const Test = mongoose.model('test', TestSchema)

module.exports = {
    Test,
    Questions
}