const File = require('../models/file')
const formidable = require('formidable')
const fs = require('fs')

const getFiles = (req, res) => {
    let groupName = req.params.groupName
}

const getFile = (req, res) => {
    let groupName = req.params.groupName
    let fileid = req.body.id
    // Example for Marta. Hay que buscar primero el nombre del archivo a través del _id que nos dan
    fs.readFile('files/' + groupName + '/report.pdf', function (err, data) {
        if (err) throw err
        const pdf = data.toString('base64')
        console.log(pdf)
    })
}

const addFile = (req, res) => {
    let file = new File()
    let error = ''
    let invalid = true
    try {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fields) {
            if (err) return res.status(409).send({ msg: `Error uploading the file: ${error}` })
            var extension = fields.file.split(',')[0].split('/')[1].split(';')[0]
            var data = fields.file.split(',')[1]

            if (req.params.groupName !== null || fields.file !== null || fields.name !== null) invalid = false
            else error = 'Invalid group'
            file.name = fields.name
            file.type = extension
            file.path = 'files/' + req.params.groupName.toString() + '/' + file.name

            if (!fs.existsSync('files/' + req.params.groupName)) {
                fs.mkdirSync('files/' + req.params.groupName)
            }

            let base64data = data.replace(/^data:.*/, '')
            fs.writeFile(file.path, base64data, 'base64', (err) => {
                if (err) return res.status(409).send({ msg: `Error uploading the file: ${error}` })
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