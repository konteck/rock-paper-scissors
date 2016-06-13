var express = require('express');
var mongoose = require('mongoose');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// listening for new connections on port
server.listen(8000);

// some express setup
app.set('views', './views');
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
app.use(express.static('./media'));

// database connection
mongoose.connect('mongodb://localhost/RPS');
mongoose.connection.on('error', function (e) {
    console.error('unable to connect to database', e);
});

/*Database stuff*/
var Player = new mongoose.Schema({
    name: {type: String, default: null},
    score: {type: Number, default: 0}
});
Player = mongoose.model('Player', Player);

// tell io to stfu
// io.set('log level', 0);

io.sockets.on('connection', function (socket) {
    socket.on('set_winner', function (msg) {
        Player.update(msg, {
            $set: {name: msg.name},
            $inc: {score: 1}
        }, {upsert: true}, function (err, doc) {
            if (err) console.log(err);
        });
    });
    socket.on('get_winners', function (msg) {
        Player.find().sort({score: -1}).exec(function (err, doc) {
            socket.emit('winners_list', doc);
        });
    });
});

app.get('/', function (req, res) {
    res.render('index');
});
