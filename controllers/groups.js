const Group = require('../models/group')
// const { check, validationResult } = require('express-validator');

const createGroup = (req, res) => {
    let group = new Group()
    group.name = req.body.name
    group.center = req.body.center
    group.tags = req.body.tags
    group.visibility = req.body.visibility
    if ('private'.match(req.body.visibility)) group.password = req.body.password
    group.avatar = group.gravatar()

    if (group.validatePassword() || 'public'.match(req.body.visibility)) {
        group.save((err) => {
            if (err) return res.status(409).send({ msg: `Error creating the group: ${err}` })
            return res.status(200).send({ group: group })
        })
    } else return res.status(403).send({ msg: `Error creating the group, invalid data:` })
}
/*
const getGroups = (req, res) => {
    Group.find(function (err, groups) {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!groups) return res.status(404).send({ message: `The group doesn't exist: ${err}` })

        res.json(groups)
    })
} */

const getGroup = (req, res) => {
    let groupId = req.params.groupId

    Group.findById(groupId, (err, group) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!group) return res.status(404).send({ message: `The group doesn't exist: ${err}` })

        res.status(200).send(group)
    })
}

const deleteGroup = (req, res) => {
    let groupId = req.params.groupId

    Group.findById(groupId, (err, group) => {
        if (err) return res.status(500).send({ message: `Error deleting the group: ${err}` })

        Group.deleteOne(group, err => {
            if (err) return res.status(500).send({ message: `Error deleting the group: ${err}` })
            res.status(200).send({ message: 'The group has been deleted successfully' })
        })
    })
}

async function getGroups(req, res){

    let infogroups = []
    let groups = req.body.usergroups
    for(let i=0; i<groups.length; i++) {
        await Group.find({name : groups[i]}, function (err, infogroup) {
            if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
            if (!infogroup) return res.status(404).send({ message: `Group doesnt exist: ${err}` })
            infogroups.push(infogroup[0])
    }).select("name tags avatar ")}
    res.status(200).send(infogroups)
}

/*
const subscribe = (req, res) =>{
    let groupId = req.params.groupId
    let.groupPassword = req.params.password
    if(validaation = false){
        afegir al id del usuari al array de ids que pertanyen el grup
        user.add(gtoupId)
    } else {
    comprobar que el password que ha introduit el usuari es el mateix del gru`p
    if ( grouppassword == passwordusuari) {
        mateixa linia d'abans
        user.add(gtoupId)
    } else {
        retornar algun error amb missatge que no coincideix les contrasenyes
    }
    }
}
*/

module.exports = {
    createGroup,
    deleteGroup,
    getGroup,
    getGroups

}
