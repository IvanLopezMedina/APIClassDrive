const File = require('../models/file')

const getFiles = (req, res) => {
    let groupName = req.params.groupName
}

module.exports = {
    getFiles
}

const addFile = (req, res) => {
    let file = new File()

    file.name = req.body.name


    file.save((err) => {
        if (err) return res.status(409).send({ msg: `Error al subir archivo: ${err}` })
        return res.status(200).send({ msg: `File added successfuly` })    
    })
}