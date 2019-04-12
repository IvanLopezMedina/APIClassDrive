const File = require('../models/file')
const formidable = require('formidable')
const fs = require('fs')

const getFiles = (req, res) => {
    let groupName = req.params.groupName
}

const addFile = (req, res) => {
    let file = new File()
    let error = ''
    let invalid = true
    try {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fields) {
            if (err) console.log(err)
            var extension = fields.file.split(',')[0].split('/')[1].split(';')[0]
            var data = fields.file.split(',')[1]

            if (req.params.groupName === null || fields.file === null || fields.name === null) invalid = true
            else error = 'Invalid group'
            file.name = fields.name
            file.type = extension
            file.path = 'files/' + req.params.groupName.toString() + '/'

            if (!fs.existsSync('files/' + req.params.groupName)) {
                fs.mkdirSync('files/' + req.params.groupName)
            }

            let base64data = data.replace(/^data:.*/, '')
            fs.writeFile(file.path + file.name, base64data, 'base64', (err) => {
                if (err) {
                    console.log(err)
                }
            })

            file.save((err) => {
                if (err || invalid) return res.status(409).send({ msg: `Error uploading the file: ${error}` })
                return res.status(200).send({ msg: `File added successfuly` })
            })
        })
    } catch (e) {
        error = 'No file/group provided'
    }
}

module.exports = {
    getFiles,
    addFile
}