const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TestSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true },
    groupName: {
        type: String},
    },
    {
    versionKey: false
})

const questionsSchema = new Schema({
    question: String,
    answer: [String],
    correctAnswer: [String]
})

const Test = mongoose.model('test', TestSchema)
const Questions = mongoose.model('questions', questionsSchema)

module.exports = {
    Test,
    Questions
}