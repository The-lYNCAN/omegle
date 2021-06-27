console.log("Connected to the HTML file")
const socket = io.connect()
var myOwnID = null
var myRoom = ""

socket.on("conne", (data) => {
    console.log(data);
    myOwnID = socket.id
    console.log(myOwnID);
    socket.emit("min", myOwnID)
    socket.emit("joint")
})

socket.emit("cli", "Server Hello")

socket.on("joined", (data) => {
    console.log("someone joined your chat");
    myRoom = data["room"]
    console.log(myRoom);
    console.log("And the one who joined your room was");
    console.log(data["id"]);
    document.getElementsByClassName("body-container")[0].innerHTML = ""
})

document.getElementById("sendBtn").addEventListener("click", () => {
    console.log(myRoom);
    const message = document.getElementById("msgArea").value
    // console.log(message);
    socket.emit("send_msg", {room: myRoom, msg: message})
    document.getElementById("msgArea").value = ""
})

socket.on("message", (data) => {
    console.log(data);
    console.log(myOwnID);
    if(data["from"] !== myOwnID){
        console.log("sent by me");
        // <div class="msg"><spam class="msgContainer"><b class="msgSpam">Strangers: </b>Hi</spam><!-- <p>Hi</p> --></div>
        // document.getElementsByClassName("body-container")[0].innerHTML = document.getElementsByClassName("body-container")[0].innerHTML + `<div class="msg"><spam class="msgSpammine"><b class="msgSpammine">You: </b></spam>${data["message"]}</div>`
        document.getElementsByClassName("body-container")[0].innerHTML = document.getElementsByClassName("body-container")[0].innerHTML + `<div class="msg"><spam class="msgContainer"><b class="msgSpam">Strangers: </b>${data["message"]}</spam><!-- <p>Hi</p> --></div>`
    }else{
        document.getElementsByClassName("body-container")[0].innerHTML = document.getElementsByClassName("body-container")[0].innerHTML + `<div class="msg"><spam class="msgContainer"><b class="msgSpammine">You: </b>${data["message"]}</spam><!-- <p>Hi</p> --></div>`
        // document.getElementsByClassName("body-container")[0].innerHTML = document.getElementsByClassName("body-container")[0].innerHTML + `<div class="msg"><spam class="msgContainer"><b class="msgSpammine">You: </b>${data["message"]}</spam><!-- <p>Hi</p> --></div>`
    }
})

document.getElementById("newBtn").addEventListener("click", () => {
    socket.emit("random", {room: myRoom, id: myOwnID})
    document.getElementsByClassName("body-container")[0].innerHTML = document.getElementsByClassName("body-container")[0].innerHTML + `<div class="msg"><spam class="msgContainer"><b class="msgSpammine">You Left the Room. Please Refresh The page to connect to someone else</b></spam><!-- <p>Hi</p> --></div>`
})

socket.on("tt", data => {
    console.log(data);
})

socket.on("abort", data => {
    console.log(data);
    socket.emit("aborting", {room: myRoom})
    document.getElementsByClassName("body-container")[0].innerHTML = document.getElementsByClassName("body-container")[0].innerHTML + `<div class="msg"><spam class="msgContainer"><b class="msgSpam">Stranger Left the Room. Please Refresh the page to connect to someone else</b></spam><!-- <p>Hi</p> --></div>`
})

socket.on("wait", () => {
    document.getElementsByClassName("body-container")[0].innerHTML = `<div class="msg"><spam class="msgContainer"><b class="msgSpam">Please wait Till someone joins</b></spam><!-- <p>Hi</p> --></div>`
})

document.addEventListener("keydown", (e)=> {
    if(e.key === "Enter"){
        if(document.getElementById("msgArea").value === ""){

        }else{
            document.getElementById("sendBtn").click()
        }
        // document.getElementById("msgArea").value = ""
    }

    if(e.key === "Escape"){
        document.getElementById("newBtn").click()
    }
    
    console.log(e);
})

document.addEventListener("keyup", (e)=> {
    if(e.key === "Enter"){
        // document.getElementById("sendBtn").click()
        document.getElementById("msgArea").value = ""
    }
    // console.log(e);
})