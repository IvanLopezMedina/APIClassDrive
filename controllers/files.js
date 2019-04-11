const File = require('../models/file')

const getFiles = (req, res) => {
    let groupName = req.params.groupName
}

const addFile = (req, res) => {
    let file = new File()
    let error = ''
    let invalid = true
    
    try {
        console.log(req.params)
        if (req.params.groupName === null) invalid = true
        else error = 'Invalid group'
        let fileSplitted = req.body.name.toString().split('.')
        file.name = fileSplitted[0]
        file.type = fileSplitted[1]
        file.path = 'files/' + req.params.groupName.toString() + req.body.name.toString()
        if (fileSplitted.length === 2) invalid = false
        else error = 'Invalid format'
    } catch (e) {
        error = 'No file/group provided'
    }

    file.save((err) => {
        if (err || invalid) return res.status(409).send({ msg: `Error uploading the file: ${error}` })
        return res.status(200).send({ msg: `File added successfuly` })
    })
}

module.exports = {
    getFiles,
    addFile
}