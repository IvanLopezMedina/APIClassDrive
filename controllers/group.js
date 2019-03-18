const Group = require('../models/group')

const creatGroup = (req, res) => {
    console.log(req.body)
    let group = new Group()
    group.name = req.body.name
    group.center = req.body.center
    group.degree = req.body.degree
    group.tags = req.body.tags
    group.type = req.body.type
    group.picture = group.gravatar()
    group.password = req.body.password
    group.save((err) => {
        if (err) return res.status(500).send({ msg: `Error al crear grupo: ${err}` })
        return res.status(200).send({ group })
    })
}
const getGrups = (req, res) => {
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
const updateGroup = (req, res) => {
    let groupId = req.params.groupId
    let update = req.body

    Group.findByIdAndUpdate(groupId, update, (err, groupUpdated) => {
        if (err) return res.status(500).send({ message: `Error updating product: ${err}` })

        res.status(200).send({ user: groupUpdated })
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
    creatGroup,
    getGrups,
    getGroup,
    updateGroup,
    deleteGroup
}
