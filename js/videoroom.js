/* =========================================
   WEBRTC VIDEO CALL
========================================= */

const localVideo =
document.getElementById("localVideo");

const remoteVideo =
document.getElementById("remoteVideo");

let localStream;
let remoteStream;

let peerConnection;

const servers = {

    iceServers: [

        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302"
            ]
        }

    ]
};



/* =========================================
   ROOM ID
========================================= */

const params =
new URLSearchParams(window.location.search);

const roomId =
params.get("room");



/* =========================================
   START CAMERA + MIC
========================================= */

async function startVideo(){

    localStream =
    await navigator.mediaDevices.getUserMedia({

        video:true,
        audio:true

    });

    remoteStream =
    new MediaStream();

    localVideo.srcObject =
    localStream;

    remoteVideo.srcObject =
    remoteStream;
}

startVideo();



/* =========================================
   CREATE PEER CONNECTION
========================================= */

function createPeerConnection(){

    peerConnection =
    new RTCPeerConnection(servers);



    /* SEND TRACKS */

    localStream.getTracks().forEach(track => {

        peerConnection.addTrack(

            track,
            localStream

        );

    });



    /* RECEIVE TRACKS */

    peerConnection.ontrack = event => {

        event.streams[0]
        .getTracks()
        .forEach(track => {

            remoteStream.addTrack(track);

        });

    };



    /* SEND ICE */

    peerConnection.onicecandidate =
    async event => {

        if(event.candidate){

            await firebasePush(

                firebaseRef(
                    database,
                    "rooms/" +
                    roomId +
                    "/candidates"
                ),

                JSON.stringify(
                    event.candidate
                )

            );

        }

    };
}



/* =========================================
   CREATE CALL
========================================= */

async function createCall(){

    createPeerConnection();



    const offer =
    await peerConnection.createOffer();

    await peerConnection
    .setLocalDescription(offer);



    await firebaseSet(

        firebaseRef(
            database,
            "rooms/" +
            roomId +
            "/offer"
        ),

        JSON.stringify(offer)

    );



    firebaseOnValue(

        firebaseRef(
            database,
            "rooms/" +
            roomId +
            "/answer"
        ),

        async snapshot => {

            const data =
            snapshot.val();

            if(
                data &&
                !peerConnection
                .currentRemoteDescription
            ){

                const answer =
                JSON.parse(data);

                await peerConnection
                .setRemoteDescription(

                    new RTCSessionDescription(
                        answer
                    )

                );

            }

        }

    );
}



/* =========================================
   ANSWER CALL
========================================= */

async function answerCall(){

    createPeerConnection();



    const offerSnapshot =
    await firebaseGet(

        firebaseRef(
            database,
            "rooms/" +
            roomId +
            "/offer"
        )

    );



    const offer =
    JSON.parse(
        offerSnapshot.val()
    );



    await peerConnection
    .setRemoteDescription(

        new RTCSessionDescription(
            offer
        )

    );



    const answer =
    await peerConnection
    .createAnswer();

    await peerConnection
    .setLocalDescription(answer);



    await firebaseSet(

        firebaseRef(
            database,
            "rooms/" +
            roomId +
            "/answer"
        ),

        JSON.stringify(answer)

    );

}



/* =========================================
   AUTO CONNECT
========================================= */

setTimeout(async () => {

    const roomSnapshot =
    await firebaseGet(

        firebaseRef(
            database,
            "rooms/" +
            roomId +
            "/offer"
        )

    );



    if(roomSnapshot.exists()){

        answerCall();

    }

    else{

        createCall();

    }

},2000);



/* =========================================
   FEATURE CARDS
========================================= */

const featureCards =
document.querySelectorAll(".featureCard");

const activityWindow =
document.querySelector(".activityWindow");



featureCards.forEach(card => {

    card.addEventListener("click", async () => {

        const title =
        card.querySelector(".featureText")
        .innerText
        .trim();



        /* RESET ACTIVE */

        featureCards.forEach(c => {

            c.style.background =
            "rgba(20,27,52,0.72)";

            c.style.borderColor =
            "rgba(255,255,255,0.06)";
        });



        card.style.background =
        "#1B2444";

        card.style.borderColor =
        "#8B5CF6";



        /* =========================================
           WATCH PARTY
        ========================================= */

        if(title === "Watch Party"){

            activityWindow.innerHTML = `

            <div class="watchPartyUI">

                <div class="playlistHeader">

                    <h2>
                        🎵 Shared Playlist
                    </h2>

                    <p>
                        Enjoy synced music together
                    </p>

                </div>

                <div class="playerArea">

                    <iframe
width="100%"
height="100%"
src="https://www.youtube.com/embed/videoseries?list=PLIlng4MI3pW88NAuEBtQlGT4WEAae5NPA"
title="YouTube video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerpolicy="strict-origin-when-cross-origin"
allowfullscreen>
</iframe>

                </div>

            </div>

            `;
        }



        /* =========================================
           SCREEN SHARE
        ========================================= */

        else if(title === "Screen Share"){

            try{

                const stream =
                await navigator
                .mediaDevices
                .getDisplayMedia({

                    video:true,
                    audio:true

                });



                activityWindow.innerHTML = `

                <div class="screenShareWrapper">

                    <video
                    id="screenVideo"
                    autoplay
                    playsinline>
                    </video>

                </div>

                `;



                const screenVideo =
                document.getElementById(
                    "screenVideo"
                );



                screenVideo.srcObject =
                stream;

            }

            catch{

                alert(
                    "Screen Share Cancelled"
                );
            }

        }


        /* =========================================
   GAMES
========================================= */

else if(title === "Games"){

    activityWindow.innerHTML = `

    <div class="gamesUI">

        <h1 class="gamesTitle">
            🎮 Game Zone
        </h1>

        <div class="gamesGrid">

            <!-- TIC TAC TOE -->

            <div class="gameCard">

                <div class="gameImage ticGame">
                    ❌
                </div>

                <div class="gameContent">

                    <h2>
                        Tic Tac Toe
                    </h2>

                    <p>
                        Play multiplayer with friends
                    </p>

                    <button
                    class="playBtn"
                    id="startTicTacToe">

                        Play Now

                    </button>

                </div>

            </div>



            <!-- UNO -->

            <div class="gameCard">

                <div class="gameImage unoGame">
                    🃏
                </div>

                <div class="gameContent">

                    <h2>
                        UNO Party
                    </h2>

                    <p>
                        Multiplayer UNO with friends
                    </p>

                    <button
                    class="playBtn">

                        Coming Soon

                    </button>

                </div>

            </div>



            <!-- SNAKE -->

            <div class="gameCard">

                <div class="gameImage snakeGame">
                    🐍
                </div>

                <div class="gameContent">

                    <h2>
                        Snake Battle
                    </h2>

                    <p>
                        Real-time snake challenge
                    </p>

                    <button
                    class="playBtn">

                        Coming Soon

                    </button>

                </div>

            </div>



            <!-- QUIZ -->

            <div class="gameCard">

                <div class="gameImage quizGame">
                    🧠
                </div>

                <div class="gameContent">

                    <h2>
                        Quiz Arena
                    </h2>

                    <p>
                        Live multiplayer quiz battles
                    </p>

                    <button
                    class="playBtn">

                        Coming Soon

                    </button>

                </div>

            </div>

        </div>

    </div>

    `;



    /* START TIC TAC TOE */

    document
    .getElementById("startTicTacToe")
    .addEventListener("click", () => {

        activityWindow.innerHTML = `

        <iframe
        src="games/tictactoe.html"
        class="gameFrame">
        </iframe>

        `;

    });

}



        /* =========================================
           WHITEBOARD
        ========================================= */

        else if(title === "Whiteboard"){

            activityWindow.innerHTML = `

            <div class="whiteboardContainer">

                <canvas id="whiteboard"></canvas>

                <button id="clearBoard">

                    Clear Board

                </button>

            </div>

            `;



            const canvas =
            document.getElementById(
                "whiteboard"
            );



            const ctx =
            canvas.getContext("2d");



            canvas.width =
            activityWindow.clientWidth;

            canvas.height =
            activityWindow.clientHeight;



            let drawing = false;



            canvas.addEventListener(
                "mousedown",
                () => {

                    drawing = true;
                }
            );



            canvas.addEventListener(
                "mouseup",
                () => {

                    drawing = false;

                    ctx.beginPath();
                }
            );



            canvas.addEventListener(
                "mousemove",
                draw
            );



            function draw(event){

                if(!drawing) return;



                const rect =
                canvas.getBoundingClientRect();



                ctx.lineWidth = 4;

                ctx.lineCap = "round";

                ctx.strokeStyle = "#000";



                ctx.lineTo(

                    event.clientX - rect.left,

                    event.clientY - rect.top

                );



                ctx.stroke();

                ctx.beginPath();



                ctx.moveTo(

                    event.clientX - rect.left,

                    event.clientY - rect.top

                );
            }



            document
            .getElementById("clearBoard")
            .onclick = () => {

                ctx.clearRect(

                    0,
                    0,
                    canvas.width,
                    canvas.height

                );

            };
        }

    });

});



/* =========================================
   MIC BUTTON
========================================= */

const micBtn =
document.querySelectorAll(".controlBtn")[0];

let micOn = true;

micBtn.addEventListener("click", () => {

    micOn = !micOn;

    micBtn.innerHTML =
    micOn ? "🎤" : "🔇";



    localStream
    .getAudioTracks()[0]
    .enabled = micOn;

});



/* =========================================
   CAMERA BUTTON
========================================= */

const camBtn =
document.querySelectorAll(".controlBtn")[1];

let camOn = true;

camBtn.addEventListener("click", () => {

    camOn = !camOn;

    camBtn.innerHTML =
    camOn ? "📹" : "🚫";



    localStream
    .getVideoTracks()[0]
    .enabled = camOn;

});



/* =========================================
   EMOJI BUTTON
========================================= */

const emojiBtn =
document.querySelectorAll(".controlBtn")[2];

const emojis =
["🔥","😂","😍","👏","🎉"];



emojiBtn.addEventListener("click", () => {

    const emoji =
    document.createElement("div");



    emoji.innerText =
    emojis[
        Math.floor(
            Math.random() *
            emojis.length
        )
    ];



    emoji.style.position =
    "absolute";

    emoji.style.left =
    Math.random()*80 + "%";

    emoji.style.bottom =
    "120px";

    emoji.style.fontSize =
    "50px";

    emoji.style.animation =
    "floatUp 2s linear forwards";



    document.body.appendChild(
        emoji
    );



    setTimeout(() => {

        emoji.remove();

    },2000);

});



/* =========================================
   LEAVE ROOM
========================================= */

document
.querySelector(".leaveBtn")
.addEventListener("click", () => {

    window.location.href =
    "home.html";

});



/* =========================================
   END CALL
========================================= */

document
.querySelector(".endCallBtn")
.addEventListener("click", () => {

    if(peerConnection){

        peerConnection.close();
    }

    alert("Call Ended");

    window.location.href =
    "home.html";

});



/* =========================
   REMOTE USER CONNECT
========================= */

const remoteVideoCard =
document.getElementById(
    "remoteVideoCard"
);

const remoteUserLabel =
document.getElementById(
    "remoteUserLabel"
);



function showRemoteUser(name){

    remoteVideoCard.style.display =
    "block";

    remoteUserLabel.innerText =
    name;
}



function hideRemoteUser(){

    remoteVideoCard.style.display =
    "none";
}