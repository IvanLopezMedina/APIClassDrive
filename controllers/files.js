const File = require('../models/file')

const getFiles = (req, res) => {
    let groupName = req.params.groupName
}



const addFile = (req, res) => {
    let file = new File()
    try{
        file.name = req.body.name.toString().split('.')[0]
        file.type = req.body.name.toString().split('.')[1]
    } catch { 
        var error = 'Not a valid file'
    }
    
    file.save((err) => {
        if (err) return res.status(409).send({ msg: `Error al subir archivo: ${error}` })
        return res.status(200).send({ msg: `File added successfuly` })    
    })
}

module.exports = {
    getFiles,
    addFile
}