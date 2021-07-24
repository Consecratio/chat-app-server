// configure dotenv
require('dotenv').config()

// required for server
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')

// configure express app
const app = express()
const PORT = process.env.PORT || 3001
const rowdyResults = rowdy.begin(app)
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.ORIGIN,
        methods: ['GET', 'POST']
    }
})

// middlewares
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello from the backend')
})

io.on('connection', (socket) => {
    console.log('A user connected')
    socket.emit('connection', null)
})

server.listen(PORT, () => {
    rowdyResults.print()
    console.log(`Listening on port: ${PORT}`)
})