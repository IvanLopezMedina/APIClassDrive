const Group = require('../models/group')
// const { check, validationResult } = require('express-validator');

const createGroup = (req, res) => {
    let group = new Group()
    let id = req.body.user
    group.name = req.body.name
    group.visibility = req.body.visibility
    group.tags = req.body.tags
    // if ('private'.match(req.body.visibility) || 'closed'.match(req.body.visibility)) group.password = req.body.password
    if ('private'.match(req.body.visibility)) group.password = req.body.password
    // if ('public'.match(req.body.visibility) || 'private'.match(req.body.visibility)) group.tags = req.body.tags
    group.admin = id
    group.users = [id]
    group.avatar = group.gravatar()

    if (group.validatePassword() || 'public'.match(req.body.visibility)) {
        group.save((err) => {
            if (err) return res.status(409).send({ msg: `Error creating the group: ${err}` })
            return res.status(200).send({ group: group })
        })
    } else return res.status(403).send({ msg: `Error creating the group, invalid data:` })
}
const getGroup = (req, res) => {
    let groupId = req.params.groupId

    Group.findById(groupId, (err, group) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!group) return res.status(404).send({ message: `The group doesn't exist: ${err}` })

        res.status(200).send(group)
    })
}

const getGroupName = (req, res) => {
    Group.findOne({ name: req.body.name }, (err, group) => {
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

const searchGroup = (req, res) => {
    let search = req.body.search
    Group.find({ name: new RegExp('^' + search + '.*$', 'i') }, { '_id': 0, 'name': 1 }, { sort: { name: 1 }, limit: 10 }, (err, search) => {
        let groups = []
        for (var i = 0; i < search.length; i++) {
            groups.push(search[i]['name'])
        }
        if (err) return res.status(500).send({ message: `Error searching groups: ${err}` })
        return res.status(200).send(groups)
    })
}
const getGroupwithSearch = (req, res) => {
    let search = req.body.search
    Group.find({ name: new RegExp('^' + search + '.*$', 'i') }, { '_id': 0, 'name': 1, 'tags': 1, 'visibility': 1, 'users': 1 }, { sort: { name: 1 }, limit: 10 }, (err, search) => {
        let groups = []
        for (var i = 0; i < search.length; i++) {
            search[i]['users'][0] = search[i]['users'].length
            groups.push(search[i])
        }
        console.log(groups)
        if (err) return res.status(500).send({ message: `Error searching groups: ${err}` })
        return res.status(200).send(groups)
    })
}

// function for menu
async function getGroups (req, res) {
    let infogroups = []
    let groups = req.body.usergroups
    for (let i = 0; i < groups.length; i++) {
        await Group.find({ name: groups[i] }, function (err, infogroup) {
            if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
            if (!infogroup) return res.status(404).send({ message: `Group doesnt exist: ${err}` })
            infogroups.push(infogroup[0])
        }).select(' name tags avatar ')
    }
    res.status(200).send(infogroups)
}
module.exports = {
    createGroup,
    deleteGroup,
    getGroup,
    getGroups,
    searchGroup,
    getGroupwithSearch,
    getGroupName
}
