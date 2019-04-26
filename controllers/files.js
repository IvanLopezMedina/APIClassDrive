const File = require('../models/file')
const Group = require('../models/group')
const formidable = require('formidable')
const fs = require('fs')

const getFiles = (req, res) => {
    File.find({ groupName: req.params.groupName }, (err, files) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!files) return res.status(404).send({ message: `No files: ${err}` })
        return res.status(200).send({ files })
    }).select('_id, name type user uploadDate')
}

const getFile = (req, res) => {
    let fileId = req.params.fileId
    File.findById(fileId, (err, file) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!file) return res.status(404).send({ message: `The file doesn't exist: ${err}` })

        fs.readFile(file.path, function (err, data) {
            if (err) return res.status(409).send({ message: `File no longer available: ${err}` })
            const file = data.toString('base64')
            res.status(200).send({ file })
        })
    })
}

const addFile = (req, res) => {
    let file = new File()
    let error = ''
    let invalid = true
    try {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fields) {
            if (err) return res.status(409).send({ msg: `Error uploading the file: ${err}` })
            var extension = fields.file.split(',')[0].split('/')[1].split(';')[0]
            var data = fields.file.split(',')[1]

            if (req.params.groupName !== null || fields.file !== null || fields.name !== null) invalid = false
            else error = 'Invalid group'
            file.name = fields.name
            file.userId = fields.userId
            file.type = extension
            file.groupName = req.params.groupName
            file.path = 'files/' + req.params.groupName.toString() + '/' + file.name
            file.user = fields.user
            console.log(fields.user)

            if (!fs.existsSync('files/' + req.params.groupName)) {
                fs.mkdirSync('files/' + req.params.groupName)
            }

            let base64data = data.replace(/^data:.*/, '')
            fs.writeFile(file.path, base64data, 'base64', (err) => {
                if (err) return res.status(409).send({ msg: `Error uploading the file: ${err}` })
            })

            file.save((err) => {
                if (err || invalid) return res.status(409).send({ msg: `Error uploading the file: ${err}` })
                return res.status(200).send({ msg: `File added successfuly` })
            })
        })
    } catch (e) {
        error = 'No file/group provided'
    }
}

const deleteFile = (req, res) => {
    let fileId = req.body.fileId
    let owner = req.body.userId

    Group.find({ name: req.params.groupName }, (err, group) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!group) return res.status(404).send({ message: `No files: ${err}` })
        File.findById(fileId, (err, file) => {
            if (err) return res.status(409).send({ message: `Error deleting the file: ${err}` })
            if (!file) return res.status(404).send({ message: `File not found` })
            if (owner.match(file.userId) || owner.match(group[0].admin)) {
                File.deleteOne(file, err => {
                    if (err) return res.status(409).send({ message: `Error deleting the file: ${err}` })
                    fs.unlink(file.path, function (err) {
                        if (err) return res.status(409).send({ message: `Error deleting the file: ${err}` })
                        res.status(200).send({ message: 'The file has been deleted successfully' })
                    })
                })
            } else return res.status(403).send({ message: `Forbidden. The file is not yours. Contact the group admin` })
        })
    })
}

module.exports = {
    getFiles,
    getFile,
    addFile,
    deleteFile
}
