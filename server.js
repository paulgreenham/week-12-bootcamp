const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./server/routes/api')
const socketIo = require('socket.io')


// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/DBNAME', {useNewUrlParser: true})


const app = express()
app.use(express.static(path.join(__dirname, 'build')))
// app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
//     next()
// })
app.use('/', api)


const port = 3000
const server = app.listen(port, function () {
    console.log(`Server running on port ${port}`)
})

const io = socketIo(server)
const rooms = []

io.on("connection", function(socket) {
    console.log("New connection on socket id:" + socket.id)
    socket.emit('rooms-to-client', rooms)

    let room

    socket.on('join-room', function (joinData) {
        room = joinData.room
        socket.join(room)
        io.sockets.in(room).emit('new-join', `${joinData.name} has joined room: ${room}`)
    })

    socket.on('create-room', function (roomName) {
        room = roomName
        rooms.push(room)
        socket.join(room)
    })

    socket.on('msg-to-server', function (message) {
        io.sockets.in(room).emit('msg-from-server', message)
    })

    // socket.on('disconnect', function () {
    //     socket.leave(room)
    //     if (io.sockets.adapter.rooms[room] && io.sockets.adapter.rooms[room].length < 1) {
    //         io.sockets.adapter.rooms[room] = null
    //     }
    // })
})