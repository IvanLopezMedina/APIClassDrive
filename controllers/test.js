const Test = require('../models/test')

const addTest = (req, res) => {
    let test = new Test()
    test.groupName = req.body.groupName
    test.questions = req.body.questions

    test.save(err => {
        if (err) return res.status(409).send({ msg: `${error} ya existe. Utilice otro ${error}` })
        return res.status(200).send({ msg: `Test added successful` })
    })
}

const getAllTest = (req, res) => {
    let groupName = req.params.groupName

    Test.findById(groupName, (err, test) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!test) return res.status(404).send({ message: `The test doesn't exist: ${err}` })

        res.status(200).send(test)
    })
}

const getTest = (req, res) => {
    let testId = req.params.testId

    Test.findById(testId, (err, test) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!test) return res.status(404).send({ message: `The test doesn't exist: ${err}` })

        res.status(200).send(test)
    })
}

const editTest = (req, res) => {
    let testId = req.params.testId
    let update = req.body

    Test.findByIdAndUpdate(testId, update, (err, testUpdated) => {
        if (err) return res.status(409).send({ message: `Error updating test: ${err}` })
        
      res.status(200).send({ test: testUpdated })
    })
}

const deleteTest = (req, res) => {
    let testId = req.params.testId

    Test.findById(testId, (err, test) => {
        if (err) return res.status(409).send({ message: `Error deleting the test: ${err}` })

        Test.deleteOne(test, err => {
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
