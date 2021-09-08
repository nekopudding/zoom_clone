const express = require('express') //loads module
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server) //passes server to socket.io
const { v4: uuidV4 } = require('uuid') 

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`) //uuid adds a random uuid to our url
}) //sets up the default path, our home page

app.get('/:room', (req,res) => {
  res.render('room', { roomId: req.params.room })
}) //sets up a a new video conference room

//runs whenever a connection is received on this url
io.on('connection', socket => {
  //when we connect socket.io, setup event listener to receive roomId, userId
  //when room is joined
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId) //sends to all other users of the same room the userId of new user

    //outputs the userId of the user who disconnected so we know which video to remove
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)