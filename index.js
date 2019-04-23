const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
const socketIo = require('socket.io')

app.set('port', process.env.PORT || config.port)

//config of Server Socket
const http = require('http')
const server = http.createServer(app);
const io = socketIo(server)


mongoose.connect(config.db, (err, res) => {
    if (err) {
        return console.log(`Error connecting to the database: ${err}`)
    }
    console.log('Connection stablished to the database...')
    server.listen(app.get('port'), () => {
        console.log(`API REST running in http://localhost:${config.port}`)
    })
})


io.on('connection', socket => {
    //console.log("Socket connected: " + socket.id)    
    socket.on('initConn', groupname => {
        socket.join(groupname)
    })
    socket.on('finishConn', groupname => {
        socket.leave(groupname)
    })
    socket.on('message', (message, groupname) => {
        socket.to(groupname).broadcast.emit('message', message)
    }) 
    socket.on('typing', (displayname, groupname) => {
        socket.to(groupname).broadcast.emit('typing', {
        message: displayname+" está escribiendo"
        })
    }) 
    socket.on('cancelTyping', groupname => {
        socket.to(groupname).broadcast.emit('cancelTyping')
    })
})