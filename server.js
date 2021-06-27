const express = require("express")
const app = express()
const Port = process.env.PORT || 3000
const path = require("path")
const io = require("socket.io")
const { v4: uuidv4 } = require("uuid")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "views")))

app.get("/", (req, res) => {
    res.render("index", {name:"Kushagar Choudhary"})
})

app.get('/video', (req, res) => {
    res.send("video texting")
})

app.get("/text", (req, res) => {
    res.render("text")
})

const server = app.listen(Port, () => {
    console.log("Server Hosted on Port 3000. Please Visit http://localhost:3000 to visit the site");
})

const sserver = io(server, {
    cors: {origin: "*"}
})
const allSockets = []
const busySockets = []
const waitingSockets = []
const rooms = []


sserver.on("connection", (socket) => {
    console.log("someone connected to the server and here is socketIO \n ");
    // console.log(socket);
    // console.log(sserver.sockets.clients('rrom'));
    allSockets.push(socket)
    socket.on("cli", (data) => {
        // console.log(data);
    })
    console.log(socket.id);
    socket.on("min", (id) => {
        allSockets.push(id)
        // console.log(id);
        // console.log(allSockets);
    })
    socket.on("joint", () => {
        // console.log("joint was called");
        // console.log(uuidv4());
        // sserver.sockets.clients('room')
        // console.log("below comes the code for length");
        // const test = sserver.sockets.adapter.rooms[socket.id.toString()]
        
        // console.log(ro);
        
        if(rooms.length === 0){
            console.log("no Rooms");
            const room = uuidv4()
            rooms.push(room)
            socket.join(room)
        }else{
            var joind = false
            rooms.forEach(element => {
                const ro = sserver.in(element).allSockets()
                ro.then(socketinRoom => {
                    console.log("I Found a Room and that is");
                    console.log(socketinRoom);
                    console.log("Below is its size");
                    console.log(socketinRoom.size);
                    if(socketinRoom.size === 2){
                        console.log(";et them have a private convo");
                    }else if(socketinRoom.size === 1){
                        console.log("I know you are waiting for me baby");
                        socket.join(element)
                        console.log(socketinRoom);
                        sserver.to(element).emit("joined", {id:socket.id, room: element})
                        joind = true
                    }else{
                        console.log("delete that room right now");
                    }
            })

            })
            if(joind){
                // console.log("just start the convo");
            }else{
                // console.log("no Rooms");
                const room = uuidv4()
                rooms.push(room)
                socket.join(room)
                socket.emit("wait")
            }
        }


    })
    socket.emit("conne", "hello FROM SERVER")
    socket.on("send_msg", (data) => {
        console.log(data);
        sserver.to(data["room"]).emit("message", {message:data["msg"], from: socket.id})
    })

    // socket.on("random", (data) => {
    //     // console.log(data);
    //     // socket.leave(data["room"])
    //     sserver.in(data["room"]).allSockets().then(other => {
    //         // console.log(other);
    //         other.forEach(user => {
    //             console.log(user);
    //             // for()
    //             console.log("somethin");
    //             console.log(sserver.sockets[user]);
    //             // console.log(sserver.sockets.sockets[user])
    //         })
    //     })
    //     // sserver.sockets.clients(data["room"]).forEach(s => {
    //     //     console.log(s);
    //     // })
    // })
    socket.on("random", data => {
        console.log(data);
        socket.leave(data["room"])
        socket.broadcast.to(data["room"]).emit("abort", {room: data["room"]})
    })
    socket.on("aborting", data => {
        socket.leave(data["room"])
    })

    socket.on("disconnect", () => {
        console.log("someone disconnected");
        allSockets.pop(socket)
        console.log("below are all sockets after poping");
        // console.log(allSockets);
        allSockets.forEach(sock => {
            console.log(sock.id);
        })
    })
})