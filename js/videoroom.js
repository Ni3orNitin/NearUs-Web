const localVideo =
document.getElementById("localVideo");

const remoteVideo =
document.getElementById("remoteVideo");

const activityWindow =
document.querySelector(".activityWindow");



/* ROOM */

const params =
new URLSearchParams(window.location.search);

const roomId =
params.get("room") || "demo-room";



/* ROOM UI */

const roomCodeText =
document.getElementById("roomCode");

const copyRoomBtn =
document.getElementById("copyRoomBtn");

roomCodeText.innerText =
roomId;



copyRoomBtn.addEventListener("click", async () => {

    await navigator.clipboard.writeText(
        window.location.href
    );

    copyRoomBtn.innerText =
    "Copied!";

    setTimeout(() => {

        copyRoomBtn.innerText =
        "Copy Link";

    },2000);

});



/* CAMERA */

async function startVideo(){

    try{

        const stream =
        await navigator
        .mediaDevices
        .getUserMedia({

            video:true,
            audio:true

        });

        localVideo.srcObject =
        stream;

    }

    catch{

        alert("Camera access denied");

    }

}

startVideo();



/* FEATURES */

const featureCards =
document.querySelectorAll(".featureCard");



featureCards.forEach(card => {

    card.addEventListener("click", async () => {

        const title =
        card.querySelector(".featureText")
        .innerText
        .trim();



        /* WATCH PARTY */

        if(title === "Watch Party"){

            activityWindow.innerHTML = `

            <div class="watchPartyUI">

                <div class="playerArea">

                    <iframe
                    src="https://www.youtube.com/embed/videoseries?list=PLIlng4MI3pW88NAuEBtQlGT4WEAae5NPA"
                    allowfullscreen>
                    </iframe>

                </div>

            </div>

            `;
        }



        /* SCREEN SHARE */

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



        /* GAMES */

        else if(title === "Games"){

            activityWindow.innerHTML = `

            <div class="gamesUI">

                <h1 class="gamesTitle">
                    🎮 Game Zone
                </h1>

                <div class="gamesGrid">

                    <div class="gameCard">

                        <div class="gameImage">
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



                    <div class="gameCard">

                        <div class="gameImage">
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



                    <div class="gameCard">

                        <div class="gameImage">
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



                    <div class="gameCard">

                        <div class="gameImage">
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



            document
            .getElementById("startTicTacToe")
            .addEventListener("click", () => {

                activityWindow.innerHTML = `

                <iframe
                src="games/tictactoe.html?room=${roomId}"
                class="gameFrame">
                </iframe>

                `;

            });

        }



        /* WHITEBOARD */

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
                () => drawing = true
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



/* MIC */

const micBtn =
document.querySelectorAll(".controlBtn")[0];

let micOn = true;

micBtn.addEventListener("click", () => {

    micOn = !micOn;

    micBtn.innerHTML =
    micOn ? "🎤" : "🔇";

});



/* CAMERA */

const camBtn =
document.querySelectorAll(".controlBtn")[1];

let camOn = true;

camBtn.addEventListener("click", () => {

    camOn = !camOn;

    camBtn.innerHTML =
    camOn ? "📹" : "🚫";

});



/* EMOJI */

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

    document.body.appendChild(
        emoji
    );

    setTimeout(() => {

        emoji.remove();

    },2000);

});



/* LEAVE */

document
.querySelector(".leaveBtn")
.addEventListener("click", () => {

    window.location.href =
    "home.html";

});



/* END CALL */

document
.querySelector(".endCallBtn")
.addEventListener("click", () => {

    alert("Call Ended");

    window.location.href =
    "home.html";

});