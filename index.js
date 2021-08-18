const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const socket = require("socket.io");
const path = require('path');

const app = express();
let users = require("./users_data.json");
let formData = require("./form_data.json");

app.use(express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'a@xyz', saveUninitialized: true, resave: true}));

var session_data;

const server = app.listen(8080);


app.get('/', (req, res) => {
    session_data = req.session;

    if (session_data.isLoggedin) {
        return res.redirect('/formData');
    }

    return res.sendFile(__dirname + "/" + 'views/login.html');
})

app.post('/login', (req, res) => {
    const {name, password} = req.body;
    const user = users.find((user) => user.name === name && user.password === password);
    if (user === undefined) {
        return res.redirect('/');
    }
    session_data = req.session;
    session_data.isLoggedin = true;
    session_data.name = name;
    session_data.isAdmin = user.isAdmin;
    return res.redirect('/formData');
})

app.get('/formData', (req, res) => {
    session_data = req.session;

    if (session_data.isAdmin) {
        return res.redirect('/notifications');
    }

    if (!session_data.isLoggedin) {
        return res.redirect('/');
    }
    return res.sendFile(__dirname + "/" + 'views/form.html');
})

app.get('/notifications', (req, res) => {
    session_data = req.session;
    if (session_data.isAdmin) {
        return res.sendFile(__dirname + "/" + 'views/notifications.html');
    }
    return res.redirect('/');
})

app.post('/formData', (req, res) => {
    session_data = req.session;
    if (session_data.isLoggedin) {
        formData.push(req.body);
        fs.writeFile('form_data.json', JSON.stringify(formData, null, 2), (err) => {
            if (err) console.log(err)
        })
        return res.json({"message": "success"})
    } else {
        return res.json({"message": "failed"})
    }
})


const io = socket(server);

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("disconnect", function () {
        console.log("Made socket disconnected");
    });

    socket.on("form_created", function (data) {
        io.emit("new_form_notification", session_data.name);
    });

});
