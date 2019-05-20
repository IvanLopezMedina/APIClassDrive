const Test = require('../models/test')

const addTest = (req, res) => {
    let test = new Test.Test()
    let question = new Test.Questions()
    test.name = req.body.name
    test.user = req.body.user
    test.creationDate = Date.now()
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
    Test.Test.find({ groupName: req.params.groupName }, { _id: 1, user: 1, creationDate: 1, name: 1 }, (err, test) => { // Añadir la cuenta de preguntas que tiene con la proyeccion (Cris en clase de Mongo)
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!test) return res.status(404).send({ message: `The test doesn't exist: ${err}` })
        res.status(200).send(test)
    })
}

const getTest = (req, res) => {
    let testId = req.params.testId

    Test.Test.findById(testId, { _id: 0, groupName: 0, creationDate: 0 }, (err, test) => {
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

    Test.Test.findByIdAndDelete(testId, (err, test) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!test) return res.status(404).send({ message: `Test does not exist` })
        return res.status(200).send({ message: 'Test deleted correctly' })
    })
}

module.exports = {
    addTest,
    getAllTest,
    getTest,
    editTest,
    deleteTest
}
