const Group = require('../models/group')
const User = require('../models/user')
const forumCtrl = require('./forums')
// const { check, validationResult } = require('express-validator');

const createGroup = (req, res) => {
    let valid = validGroup(req)
    if (valid[1]) {
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

        forumCtrl.createForum(req.body.name, res)

        if (group.validatePassword() || 'public'.match(req.body.visibility)) {
            group.save((err) => {
                if (err) return res.status(409).send({ msg: `Error creating the group: ${err}` })
                return res.status(200).send({ group: group })
            })
        } else return res.status(403).send({ msg: `Error creating the group, invalid data:` })
    } else {
        return res.status(500).send({ message: valid[0] })
    }
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

    Group.findByIdAndRemove(groupId, (err, group) => {
        if (err) return res.status(500).send({ message: `Error deleting the group: ${err}` })
        forumCtrl.deleteForum(group.name)
        res.status(200).send({ message: 'The group has been deleted successfully' })
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
const subscribe = (req, res) => {
    let groupId = req.body.groupId
    let userId = req.body.userId
    let password = req.body.password
    let groupName = req.body.groupName
    let valid = false

    Group.findById(groupId, async (err, group) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!group) return res.status(404).send({ message: `Group doesn't exist` })
        if (group.visibility === 'public') valid = true
        else {
            if (group.validatePassword) {
                await group.comparePassword(password, async (err, isMatch) => {
                    if (err) return res.status(409).send({ msg: `Subscribing password error: ${err}` })
                    if (!isMatch) return res.status(404).send({ msg: `Password incorrect` })
                    valid = isMatch
                })
            }
        }
        if (valid) {
            if (err) return res.status(409).send({ message: `Error retrieving count data: ${err}` })
            Group.updateOne({ _id: groupId, users: { $ne: userId } }, { $push: { users: userId } }, (err, result) => {
                if (err) return res.status(409).send({ message: `Error updating groups: ${err}` })
                if (result.nModified === 0) return res.status(409).send({ message: `Group already added` })
                User.updateOne({ _id: userId, groups: { $ne: groupName } }, { $push: { groups: groupName } }, (err, result) => {
                    if (err) return res.status(409).send({ message: `Error updating groups: ${err}` })
                    if (result.nModified === 0) return res.status(409).send({ message: `Group already added` })
                    res.status(200).send({ msg: 'Correct Subscribed' })
                })
            })
        } else res.status(409).send({ msg: `Invalid Password` })
    })
}

const unsubscribe = (req, res) => {
    let groupId = req.params.groupId
    let userId = req.body.userId
    let trobat = false
    let i = 0
    Group.findById(groupId, (err, group) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!group) return res.status(404).send({ message: `Group doesn't exist` })
        else {
            console.log('aa')
            while (!trobat && i < group.users.length) {
                if (userId === group.users[i]) {
                    console.log('Ha entrat el bucle')
                    trobat = true
                    group.users.splice(i)
                    return res.status(200).send(group, { message: `User eliminated` })
                }
                i++
                console.log(i)
                console.log(group.users[i])
                console.log(userId)
            }
            return res.status(200).send(group)
        }
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
            console.log(req.body.usergroups)
        }).select(' name tags avatar ')
    }
    res.status(200).send(infogroups)
}

const validGroup = function (req) {
    let name = req.body.name
    let tags = req.body.tags
    let visibility = req.body.visibility

    if (name == null || name === '') return [`Error: group name is empty`, false]
    else if (tags == null || tags === '' || tags.length === 0) return [`Error: tags is empty`, false]
    else if (visibility == null || visibility === '') return [`Error: visibility is empty`, false]
    else return ['', true]
}

module.exports = {
    createGroup,
    deleteGroup,
    getGroup,
    getGroups,
    searchGroup,
    getGroupwithSearch,
    getGroupName,
    subscribe,
    unsubscribe
}
