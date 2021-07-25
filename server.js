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

const STATIC_CHANNELS = [{
    name: 'Global Chat',
    participants: 0,
    id: 1,
    sockets: []
}, {
    name: 'Funny',
    participants: 0,
    id: 2,
    sockets: []
}]

// middlewares
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello from the backend')
})

app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
})

io.on('connection', (socket) => {
    console.log('New Client Connected')
    socket.emit('connection', null)
    socket.on('channel-join', id => {
        console.log('Channel Join', id)
        STATIC_CHANNELS.forEach(c => {
            if(c.id === id) {
                if(c.sockets.indexOf(socket.id) === -1){
                    c.sockets.push(socket.id)
                    c.participants++
                    io.emit('channel', c)
                }
            } else {
                let index = c.sockets.indexOf(socket.id)
                if(index != -1){
                    c.sockets.splice(index, 1)
                    c.participants--
                    io.emit('channel', c)
                }
            }
        })

        console.log(STATIC_CHANNELS)

        return id
    })
})

server.listen(PORT, () => {
    rowdyResults.print()
    console.log(`Listening on port: ${PORT}`)
})