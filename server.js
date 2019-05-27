const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./server/routes/api')
const socketIo = require('socket.io')


// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost/DBNAME', {useNewUrlParser: true})


const app = express()
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', api)


const port = 8000
const server = app.listen(port, function () {
    console.log(`Server running on port ${port}`)
})

const io = socketIo(server)

io.on("connection", function(socket) {
    console.log("New connection on socket id:" + socket.id)
    socket.on('receive-message', function (message) {
        io.emit('send-message', message)
    })
})