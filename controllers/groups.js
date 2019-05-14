const Group = require('../models/group')
const User = require('../models/user')
const forumCtrl = require('./forums')
const chatCtrl = require('./chat')
const Search = require('../models/search')
// const { check, validationResult } = require('express-validator');

const createGroup = async function (req, res) {
    let valid = validGroup(req)
    if (valid[1]) {
        let group = new Group()
        let search = new Search()
        let arrayTags = []
        let id = req.body.user
        let groupName = req.body.name
        group.name = groupName
        group.tags = req.body.tags

        group.visibility = req.body.visibility
        if ('private'.match(req.body.visibility)) group.password = req.body.password
        group.admin = id
        group.users = [id]
        group.avatar = group.gravatar()
        let error = false

        if (group.validatePassword() || 'public'.match(req.body.visibility)) {

        //Add Group to Collection Groups
        group.save( async function (err) {
            if (err) return res.status(409).send({ msg: `Error creating the group: ${err}` })
            else {

                //Add Group to Collection Users
                User.updateOne({ _id: id, groups: { $ne: groupName } }, { $push: { groups: groupName } }, (err, result) => {
                    if (err) return res.status(409).send({ message: `Error updating groups: ${err}` })
                    if (result.nModified === 0) return res.status(409).send({ message: `Group already added` })
                })

                //Add Group to Collection Forum
                let val = forumCtrl.createForum(req.body.name)
                if (!val[2]) {
                    return res.status(val[1]).send({ msg: val[0] })
                }

                //Add Group to Collection Chat
                val = chatCtrl.createChat(req.body.name)
                if (!val[2]) {
                    return res.status(val[1]).send({ msg: val[0] })
                }

                //Add values to Collection Search 
                await Search.countDocuments({ name: req.body.name }, function (err, count) {
                    if (err) return res.status(409).send({ message: `Error retrieving count data: ${err}` })
                    if(count === 0) { //new name
                        search.name = req.body.name.toLowerCase()
                        search.type = "name"
                        search.nSearches = 0
                        search.save((err) => {
                            if (err) return res.status(409).send({ msg: `Error creating the group: ${err}` })
                            })
                        }
                    })   
                for(let i=0; i<req.body.tags.length; i++) {
                    await Search.countDocuments({ name: req.body.tags[i] }, function (err, count) {
                        if (err) return res.status(409).send({ message: `Error retrieving count data: ${err}` })
                        if(count === 0) { //new tag
                            arrayTags.push({ name : req.body.tags[i].toLowerCase(), type : "tags", nSearches : 0 })
                        }
                    }) 
                }
                if(arrayTags.length !== 0) {
                    search.collection.insertMany(arrayTags, function (err) {
                    if (err) return res.status(409).send({ msg: `Error creating the group: ${err}` })
                    }) 
                }
            }
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
    let searchSplitted = search.split(" ")
    let lastElementSearch = searchSplitted[searchSplitted.length-1]

    Search.find({name: new RegExp('^'+lastElementSearch+'.*$', "i")}, {'_id':0, 'name': 1}, {sort: {nSearches: -1}, limit: 10}, (err, search) => {
        let groups = []
        for(let i=0; i<search.length; i++) {
            
            if(searchSplitted[0] !== search[i]['name']) {
                searchSplitted[searchSplitted.length-1] = search[i]['name'] 
                groups.push(searchSplitted.join(" "))
            }
        }
        if (err) return res.status(500).send({ message: `Error searching groups: ${err}` })
        return res.status(200).send(groups)
        })
    }

const getGroupwithSearch = async function (req, res) {
    let search = req.body.search
    let searchSplitted = search.split(' ')
    let searchMap = new Map()
    
    for(let i=0; i<searchSplitted.length; i++) {
        
        Group.find({$or : [{name : new RegExp('^'+searchSplitted[i]+'.*$', "i")}, {tags : new RegExp('^'+searchSplitted[i]+'.*$', "i")}]}, {'_id' : 0, 'name' : 1}, {limit: 50}, (err, search) => { //eliminar el limit 10
            for(var j=0; j<search.length; j++) {
                if(searchMap.has(search[j].name)) {
                    searchMap.set(search[j].name, searchMap.get(search[j].name) + 1)
                }
                else {
                    searchMap.set(search[j].name, 1)
                }
            }
            if (err) return res.status(500).send({ message: `Error searching groups: ${err}` })
        })
        
        await Search.find({name : searchSplitted[i]}, {'_id' : 0, 'name' : 1, 'nSearches' : 1}, (err, search) => {
            if(search.length !== 0) {
                for(let j=0; j<search.length; j++) { //possibility of a same tag and name
                Search.updateOne({name : search[j]['name'] }, {nSearches : search[j]['nSearches'] + 1}, (err) =>{
                    if (err) return res.status(409).send({ message: `Error updating nSearches: ${err}` })
                    })
                }
            } 
            if (err) return res.status(409).send({ message: `Error searching groups: ${err}` })
        }) 
    }

    const mapSorted = new Map([...searchMap.entries()].sort((a, b) => b[1] - a[1]));
    let infogroups = []
    for(let item of mapSorted) {
        await Group.find({name : item[0]}, {'_id' : 1, 'name' : 1, 'tags' : 1, 'visibility' : 1, 'users': 1}, (err, search) => {
        for(var i=0; i<search.length; i++) {
            search[i]['users'][0] = search[i]['users'].length     
        }
        infogroups.push(search[0]) 
        if (err) return res.status(500).send({ message: `Error searching groups: ${err}` })
        })
    }   
    return res.status(200).send(infogroups)
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
    Group.findById(groupId, (err, group) => {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        if (!group) return res.status(404).send({ message: `Group doesn't exist` })
        let groupcontainsuser = (group.users.indexOf(userId) > -1)
        if (groupcontainsuser) {
            group.users.pull({ _id: userId })
            group.save(function (err) {
                if (err) return res.status(409).send({ message: `Error subscribing: ${err}` })
                return res.status(200).send({ message: `User eliminated` })
            })
        } else return res.status(409).send({ message: `User not in the group` })
    })
}

const getGroups = (req, res) => {
    let userId = req.body.userId
    User.findById(userId, {_id:0, groups:1}, async function (err, groups) {
        if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
        let infogroups = []
        let groupArray = groups.groups
        for (let i = 0; i < groupArray.length; i++) {
            await Group.find({ name: groupArray[i] }, function (err, infogroup) {
                if (err) return res.status(409).send({ message: `Error retrieving data: ${err}` })
                if (!infogroup) return res.status(404).send({ message: `Group doesnt exist: ${err}` })
                infogroups.push(infogroup[0])
            }).select(' name tags avatar ')
        }
        res.status(200).send(infogroups)
    })
}

function getUsers (req, res) {
    let groupId = req.params.groupId

    Group.findById(groupId, (err, group) => {
        if (err) return res.status(409).send({ msg: `Error retrieving data: ${err}` })
        if (!group) return res.status(404).send({ msg: `Group doesnt exist: ${err}` })

        if (group.users == null || group.users === '' || group.users.length === 0) {
            return res.status(404).send({ msg: `Error: users is empty: ${err}` })
        } else {
            return res.status(200).send(group.users)
        }
    })
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

const isAdmin = (req, res) => {
    let message = `Not Admin`
    Group.countDocuments({ name: req.params.groupName, admin: req.body.userId }, function (err, count) {
    if (err) return res.status(409).send({ message: `Error retrieving count data: ${err}` })
        if(count === 1) { //is Admin
            message = `Admin`
        }
        return res.status(200).send({ message })
    })
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
    getUsers,
    unsubscribe,
    isAdmin
}

