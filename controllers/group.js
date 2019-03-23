const Group = require('../models/group')
// const { check, validationResult } = require('express-validator');

const createGroup = (req, res) => {
    let group = new Group()
    group.name = req.body.name
    group.center = req.body.center
    group.tags = req.body.tags
    group.visibility = req.body.visibility
    group.password = req.body.password
    group.avatar = group.gravatar()
    group.save((err) => {
        if (group.validatePassword()) {
            if (err) return res.status(500).send({ msg: `Error al crear grupo: ${err}` })
            return res.status(200).send({ group: group })
        } else {
            return res.status(403).send({ msg: 'The password for the private group is empty or invalid' })
        }
    })
}
const getGroups = (req, res) => {
    Group.find(function (err, groups) {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!groups) return res.status(404).send({ message: `The group doesn't exist: ${err}` })

        res.json(groups)
    })
}
const getGroup = (req, res) => {
    let groupId = req.params.groupId

    Group.findById(groupId, (err, group) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
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
module.exports = {
    createGroup,
    getGroups,
    getGroup,
    deleteGroup
}
