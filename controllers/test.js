const Test = require('../models/test')

const addTest = (req, res) => {
    let test = new Test.Test()
    let question = new Test.Questions()

    test.name = req.body.name
    test.groupName = req.body.groupName
    question.question = req.body.question
    question.answer = req.body.answer
    question.correctAnswer = req.body.correctAnswer

    test.questions.push(question)

    test.save(err => {

        if (err) {
            if (err.message.includes('duplicate key error') && err.name === 'MongoError') return res.status(409).send({ msg: `Un test con el nombre -${test.name}- ya existe. Utilice otro nombre` })
            return res.status(409).send({ msg: `Unhandled error: ${err.message}` })
        }
        return res.status(200).send({ msg: `Test added successfully` })
    })
}

const getAllTest = (req, res) => {
    Test.Test.find({ groupName: req.params.groupName }, (err, test) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!test) return res.status(404).send({ message: `The test doesn't exist: ${err}` })

        res.status(200).send(test)
    })
}

const getTest = (req, res) => {
    let testId = req.params.testId

    Test.Test.findById(testId, (err, test) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!test) return res.status(404).send({ message: `The test doesn't exist: ${err}` })

        res.status(200).send(test)
    })
}

const editTest = (req, res) => {
    let testId = req.params.testId
    let update = req.body

    Test.Test.findByIdAndUpdate(testId, update, (err, testUpdated) => {
        if (err) return res.status(409).send({ message: `Error updating test: ${err}` })
        res.status(200).send({ test: testUpdated })
    })
}

const deleteTest = (req, res) => {
    let testId = req.params.testId

    Test.Test.findById(testId, (err, test) => {
        if (err) return res.status(409).send({ message: `Error deleting the test: ${err}` })
        if (!test) return res.status(404).send({ message: `Test not found` })

        test.delete(err => {
            if (err) return res.status(409).send({ message: `Error deleting the test: ${err}` })
            res.status(200).send({ message: 'The test has been deleted successfully' })
        })
    })
}

module.exports = {
    addTest,
    getAllTest,
    getTest,
    editTest,
    deleteTest
}
