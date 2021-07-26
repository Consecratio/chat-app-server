// configure dotenv
require('dotenv').config()

// required for server
const express = require('express')
// const cors = require('cors')
const rowdy = require('rowdy-logger')

// configure express app
const app = express()
const PORT = process.env.PORT || 3001
const http = require('http').createServer(app)
const rowdyResults = rowdy.begin(app)
const io = require('socket.io')(http, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST']
    }
})

// middlewares
app.use(cors())

io.on('connection', socket => {
    const username = socket.handshake.query.username
    console.log(username, 'has connected!')

    socket.on('disconnect', () => {
        console.log(username, 'has disconnected')
    })

    socket.on('chat message', msg => {
        // send msg to all connected clients
        console.log(`${username} says: ${msg.content}`)
        io.emit('chat message', msg)
    })
})

server.listen(PORT, () => {
    rowdyResults.print()
    console.log(`Listening on port: ${PORT}`)
})