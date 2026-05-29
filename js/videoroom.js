// import { startCall } from "./webrtc.js";

// const localVideo =
// document.getElementById("localVideo");

// const remoteVideo =
// document.getElementById("remoteVideo");

// const activityWindow =
// document.querySelector(".activityWindow");



// /* ROOM */

// const params =
// new URLSearchParams(window.location.search);

// const roomId =
// params.get("room") || "demo-room";



// /* ROOM UI */

// const roomCodeText =
// document.getElementById("roomCode");

// const copyRoomBtn =
// document.getElementById("copyRoomBtn");

// roomCodeText.innerText =
// roomId;



// copyRoomBtn.addEventListener("click", async () => {

//     await navigator.clipboard.writeText(
//         window.location.href
//     );

//     copyRoomBtn.innerText =
//     "Copied!";

//     setTimeout(() => {

//         copyRoomBtn.innerText =
//         "Copy Link";

//     },2000);

// });



// /* CAMERA */

// async function startVideo(){

//     try{

//         const stream =
//         await navigator
//         .mediaDevices
//         .getUserMedia({

//             video:true,
//             audio:true

//         });

//         localVideo.srcObject =
//         stream;

//     }

//     catch{

//         alert("Camera access denied");

//     }

// }

// startVideo();



// /* FEATURES */

// const featureCards =
// document.querySelectorAll(".featureCard");



// featureCards.forEach(card => {

//     card.addEventListener("click", async () => {

//         const title =
//         card.querySelector(".featureText")
//         .innerText
//         .trim();



//         /* WATCH PARTY */

//         if(title === "Watch Party"){

//             activityWindow.innerHTML = `

//             <div class="watchPartyUI">

//                 <div class="playerArea">

//                     <iframe
//                     src="https://www.youtube.com/embed/videoseries?list=PLIlng4MI3pW88NAuEBtQlGT4WEAae5NPA"
//                     allowfullscreen>
//                     </iframe>

//                 </div>

//             </div>

//             `;
//         }



//         /* SCREEN SHARE */

//         else if(title === "Screen Share"){

//             try{

//                 const stream =
//                 await navigator
//                 .mediaDevices
//                 .getDisplayMedia({

//                     video:true,
//                     audio:true

//                 });

//                 activityWindow.innerHTML = `

//                 <div class="screenShareWrapper">

//                     <video
//                     id="screenVideo"
//                     autoplay
//                     playsinline>
//                     </video>

//                 </div>

//                 `;

//                 const screenVideo =
//                 document.getElementById(
//                     "screenVideo"
//                 );

//                 screenVideo.srcObject =
//                 stream;

//             }

//             catch{

//                 alert(
//                     "Screen Share Cancelled"
//                 );
//             }

//         }



//         /* GAMES */

//         else if(title === "Games"){

//             activityWindow.innerHTML = `

//             <div class="gamesUI">

//                 <h1 class="gamesTitle">
//                     🎮 Game Zone
//                 </h1>

//                 <div class="gamesGrid">

//                     <div class="gameCard">

//                         <div class="gameImage">
//                             ❌
//                         </div>

//                         <div class="gameContent">

//                             <h2>
//                                 Tic Tac Toe
//                             </h2>

//                             <p>
//                                 Play multiplayer with friends
//                             </p>

//                             <button
//                             class="playBtn"
//                             id="startTicTacToe">

//                                 Play Now

//                             </button>

//                         </div>

//                     </div>



//                     <div class="gameCard">

//                         <div class="gameImage">
//                             🃏
//                         </div>

//                         <div class="gameContent">

//                             <h2>
//                                 UNO Party
//                             </h2>

//                             <p>
//                                 Multiplayer UNO with friends
//                             </p>

//                             <button
//                             class="playBtn">

//                                 Coming Soon

//                             </button>

//                         </div>

//                     </div>



//                     <div class="gameCard">

//                         <div class="gameImage">
//                             🐍
//                         </div>

//                         <div class="gameContent">

//                             <h2>
//                                 Snake Battle
//                             </h2>

//                             <p>
//                                 Real-time snake challenge
//                             </p>

//                             <button
//                             class="playBtn">

//                                 Coming Soon

//                             </button>

//                         </div>

//                     </div>



//                     <div class="gameCard">

//                         <div class="gameImage">
//                             🧠
//                         </div>

//                         <div class="gameContent">

//                             <h2>
//                                 Quiz Arena
//                             </h2>

//                             <p>
//                                 Live multiplayer quiz battles
//                             </p>

//                             <button
//                             class="playBtn">

//                                 Coming Soon

//                             </button>

//                         </div>

//                     </div>

//                 </div>

//             </div>

//             `;



//             document
//             .getElementById("startTicTacToe")
//             .addEventListener("click", () => {

//                 activityWindow.innerHTML = `

//                 <iframe
//                 src="games/tictactoe.html?room=${roomId}"
//                 class="gameFrame">
//                 </iframe>

//                 `;

//             });

//         }



//         /* WHITEBOARD */

//         else if(title === "Whiteboard"){

//             activityWindow.innerHTML = `

//             <div class="whiteboardContainer">

//                 <canvas id="whiteboard"></canvas>

//                 <button id="clearBoard">

//                     Clear Board

//                 </button>

//             </div>

//             `;

//             const canvas =
//             document.getElementById(
//                 "whiteboard"
//             );

//             const ctx =
//             canvas.getContext("2d");

//             canvas.width =
//             activityWindow.clientWidth;

//             canvas.height =
//             activityWindow.clientHeight;

//             let drawing = false;



//             canvas.addEventListener(
//                 "mousedown",
//                 () => drawing = true
//             );



//             canvas.addEventListener(
//                 "mouseup",
//                 () => {

//                     drawing = false;

//                     ctx.beginPath();

//                 }
//             );



//             canvas.addEventListener(
//                 "mousemove",
//                 draw
//             );



//             function draw(event){

//                 if(!drawing) return;

//                 const rect =
//                 canvas.getBoundingClientRect();

//                 ctx.lineWidth = 4;

//                 ctx.lineCap = "round";

//                 ctx.strokeStyle = "#000";

//                 ctx.lineTo(

//                     event.clientX - rect.left,

//                     event.clientY - rect.top

//                 );

//                 ctx.stroke();

//                 ctx.beginPath();

//                 ctx.moveTo(

//                     event.clientX - rect.left,

//                     event.clientY - rect.top

//                 );

//             }



//             document
//             .getElementById("clearBoard")
//             .onclick = () => {

//                 ctx.clearRect(

//                     0,
//                     0,
//                     canvas.width,
//                     canvas.height

//                 );

//             };

//         }

//     });

// });



// /* MIC */

// const micBtn =
// document.querySelectorAll(".controlBtn")[0];

// let micOn = true;

// micBtn.addEventListener("click", () => {

//     micOn = !micOn;

//     micBtn.innerHTML =
//     micOn ? "🎤" : "🔇";

// });



// /* CAMERA */

// const camBtn =
// document.querySelectorAll(".controlBtn")[1];

// let camOn = true;

// camBtn.addEventListener("click", () => {

//     camOn = !camOn;

//     camBtn.innerHTML =
//     camOn ? "📹" : "🚫";

// });



// /* EMOJI */

// const emojiBtn =
// document.querySelectorAll(".controlBtn")[2];

// const emojis =
// ["🔥","😂","😍","👏","🎉"];

// emojiBtn.addEventListener("click", () => {

//     const emoji =
//     document.createElement("div");

//     emoji.innerText =
//     emojis[
//         Math.floor(
//             Math.random() *
//             emojis.length
//         )
//     ];

//     emoji.style.position =
//     "absolute";

//     emoji.style.left =
//     Math.random()*80 + "%";

//     emoji.style.bottom =
//     "120px";

//     emoji.style.fontSize =
//     "50px";

//     document.body.appendChild(
//         emoji
//     );

//     setTimeout(() => {

//         emoji.remove();

//     },2000);

// });



// /* LEAVE */

// document
// .querySelector(".leaveBtn")
// .addEventListener("click", () => {

//     window.location.href =
//     "home.html";

// });



// /* END CALL */

// document
// .querySelector(".endCallBtn")
// .addEventListener("click", () => {

//     alert("Call Ended");

//     window.location.href =
//     "home.html";

// });



// new js






// import { startCall } from "./webrtc.js";

// const localVideo =
// document.getElementById("localVideo");

// const remoteVideo =
// document.getElementById("remoteVideo");

// const roomCode =
// document.getElementById("roomCode");

// const copyRoomBtn =
// document.getElementById("copyRoomBtn");

// const params =
// new URLSearchParams(window.location.search);

// const roomId =
// params.get("room");

// roomCode.innerText = roomId;

// copyRoomBtn.addEventListener(
//     "click",
//     async ()=>{

//         await navigator.clipboard.writeText(
//             window.location.href
//         );

//         alert("Room Link Copied");

//     }
// );

// startCall(
//     roomId,
//     localVideo,
//     remoteVideo
// );



import { database } from "./firebase.js";
import { ref, set, onValue, push, onChildAdded, runTransaction } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

/* =========================================================================
   1. DOM ELEMENT BINDINGS
   ========================================================================= */
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const localOff = document.getElementById("localOff");
// FIX: Bind to the correct IDs from your new HTML template
const remoteCard = document.getElementById("remoteCard"); 
const remoteWaiting = document.getElementById("remoteWaiting");
const remoteOverlay = document.getElementById("remoteOverlay");

const localBars = document.getElementById("localBars");
const remoteBars = document.getElementById("remoteBars");

const activityWindow = document.getElementById("activityWindow");
const idlePane = document.getElementById("idlePane");
const screenPane = document.getElementById("screenPane");
const whiteboardPane = document.getElementById("whiteboardPane");
const youtubePane = document.getElementById("youtubePane");
const watchPane = document.getElementById("watchPane");

const roomCodeBtn = document.getElementById("roomCodeBtn");
const leaveBtn = document.getElementById("leaveBtn");
const endCallBtn = document.getElementById("endCallBtn");
const micBtn = document.getElementById("micBtn");
const camBtn = document.getElementById("camBtn");
const toast = document.getElementById("toast");

// Live Chat Bindings
const chatPanel = document.getElementById("chatPanel");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChatBtn = document.getElementById("sendChatBtn");
const closeChatBtn = document.getElementById("closeChatBtn");
const toggleChatPanelBtn = document.getElementById("toggleChatPanelBtn");

/* =========================================================================
   2. CONFIGURATION & STATE MANAGEMENT
   ========================================================================= */
const params = new URLSearchParams(window.location.search);
const roomId = params.get("room") || "NUS8921";
const myClientId = Math.random().toString(36).substring(2, 9); // Distinct sender id tag

if(roomCodeBtn) {
    roomCodeBtn.innerHTML = `
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg> ${roomId}`;
}

let localStream = null;
let peerConnection = null;
const servers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
    ]
};

const roomRef = ref(database, `rooms/${roomId}/calls`);
const iceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates`);
const chatRef = ref(database, `rooms/${roomId}/chat`);

/* =========================================================================
   3. LIVE TEXT CHAT REPLICATION ENGINE
   ========================================================================= */
// Open/Close Chat UI Panels Safely
toggleChatPanelBtn.onclick = () => {
    chatPanel.classList.add("open");
    toggleChatPanelBtn.style.display = "none";
    chatMessages.scrollTop = chatMessages.scrollHeight;
};
closeChatBtn.onclick = () => {
    chatPanel.classList.remove("open");
    toggleChatPanelBtn.style.display = "flex";
};

// Push fresh chat payloads up to Firebase
function emitChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    push(chatRef, {
        sender: myClientId,
        message: text,
        timestamp: Date.now()
    });
    chatInput.value = "";
}

sendChatBtn.onclick = emitChatMessage;
chatInput.onkeydown = (e) => { if (e.key === "Enter") emitChatMessage(); };

// Listen for incoming messages added from ANY linked device
onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const msgElement = document.createElement("div");
    const isMe = data.sender === myClientId;
    
    msgElement.className = `msgBlock ${isMe ? "outgoing" : "incoming"}`;
    msgElement.innerText = data.message;
    
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Keep view scrolled down
});

/* =========================================================================
   4. WEBRTC CONNECTIVITY ENGINE
   ========================================================================= */
async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
                if(remoteWaiting) remoteWaiting.style.display = "none";
                if(remoteOverlay) remoteOverlay.style.display = "flex";

                console.log("Remote video track attached successfully!");
            }
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                push(iceCandidatesRef, event.candidate.toJSON());
            }
        };

        setupSignaling();

    } catch (error) {
        console.error("Hardware initialization failed:", error);
        showToast("Camera/Microphone access required!");
    }
}

function setupSignaling() {
    runTransaction(roomRef, (currentData) => {
        if (!currentData) return { status: "hosting" };
        return currentData; 
    }).then(async (result) => {
        const data = result.snapshot.val();
        if (data && data.status === "hosting" && !data.offer) {
            console.log("Device 1 locked as Host.");
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            await set(roomRef, {
                offer: { type: offer.type, sdp: offer.sdp },
                status: "waiting-for-answer"
            });
        }
    });

    onValue(roomRef, async (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        if (data.offer && !peerConnection.currentRemoteDescription && data.status === "waiting-for-answer") {
            console.log("Device 2 processing Host Offer...");
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            await set(roomRef, {
                offer: data.offer,
                answer: { type: answer.type, sdp: answer.sdp },
                status: "connected"
            });
        } else if (data.answer && !peerConnection.currentRemoteDescription) {
            console.log("Completing Handshake loop...");
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
    });

    onChildAdded(iceCandidatesRef, (snapshot) => {
        const candidateData = snapshot.val();
        if (candidateData && peerConnection.remoteDescription) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidateData))
                .catch(e => console.error("ICE Error:", e));
        }
    });
}

startCall();

/* =========================================================================
   5. DYNAMIC INTERFACE TABS & PANE TOGGLE ACTIONS
   ========================================================================= */
const tabs = document.querySelectorAll(".featTab");
const panes = [idlePane, screenPane, whiteboardPane, youtubePane, watchPane];

const actionButtonMap = {
    "screenBtn": "screen",
    "wbBtn": "whiteboard",
    "ytBtn": "youtube"
};

Object.entries(actionButtonMap).forEach(([btnId, activityName]) => {
    const btn = document.getElementById(btnId);
    if(btn) btn.addEventListener("click", () => switchActivity(activityName));
});

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        switchActivity(tab.getAttribute("data-activity"));
    });
});

function switchActivity(activityName) {
    panes.forEach(pane => { if(pane) pane.classList.remove("active"); });
    tabs.forEach(t => t.classList.remove("active"));
    Object.keys(actionButtonMap).forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove("active");
    });

    const activePane = document.getElementById(`${activityName}Pane`);
    const activeTab = document.getElementById(`tab-${activityName}`);
    
    if (activePane) activePane.classList.add("active");
    if (activeTab) activeTab.classList.add("active");

    const relatedBtnId = Object.keys(actionButtonMap).find(key => actionButtonMap[key] === activityName);
    if(relatedBtnId) document.getElementById(relatedBtnId).classList.add("active");

    if (activityName === "whiteboard") initWhiteboardEngine();
}

/* =========================================================================
   6. WHITEBOARD DRAWING ENGINE
   ========================================================================= */
let isWbInitialized = false;
function initWhiteboardEngine() {
    if (isWbInitialized) return;
    isWbInitialized = true;

    const canvas = document.getElementById("wbCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    let drawing = false;
    let strokeColor = "#000000";
    let strokeSize = 4;
    let toolMode = "pen";

    const colors = ["#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#a855f7"];
    const colorsContainer = document.getElementById("wbColors");
    colorsContainer.innerHTML = "";
    
    colors.forEach((color, idx) => {
        const dot = document.createElement("div");
        dot.className = `colorDot ${idx === 0 ? "selected" : ""}`;
        dot.style.backgroundColor = color;
        dot.addEventListener("click", () => {
            document.querySelectorAll(".colorDot").forEach(d => d.classList.remove("selected"));
            dot.classList.add("selected");
            strokeColor = color;
            toolMode = "pen";
            document.getElementById("wbPen").classList.add("active");
            document.getElementById("wbEraser").classList.remove("active");
        });
        colorsContainer.appendChild(dot);
    });

    document.getElementById("wbPen").onclick = () => {
        toolMode = "pen";
        document.getElementById("wbPen").classList.add("active");
        document.getElementById("wbEraser").classList.remove("active");
    };
    document.getElementById("wbEraser").onclick = () => {
        toolMode = "eraser";
        document.getElementById("wbEraser").classList.add("active");
        document.getElementById("wbPen").classList.remove("active");
    };
    document.getElementById("wbSizeSlider").oninput = (e) => strokeSize = e.target.value;
    document.getElementById("wbClearBtn").onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener("mousedown", () => drawing = true);
    canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = strokeSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = (toolMode === "eraser") ? "#FFFFFF" : strokeColor;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });
}

/* =========================================================================
   7. YOUTUBE / WATCH PARTY DELEGATIONS
   ========================================================================= */
document.getElementById("ytLoadBtn").onclick = () => {
    const urlVal = document.getElementById("ytUrl").value.trim();
    let videoId = urlVal;
    
    if(urlVal.includes("v=")) videoId = urlVal.split("v=")[1].split("&")[0];
    else if(urlVal.includes("youtu.be/")) videoId = urlVal.split("youtu.be/")[1].split("?")[0];

    if(videoId) {
        document.getElementById("ytPlaceholderDiv").style.display = "none";
        const frame = document.getElementById("ytFrame");
        frame.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        frame.style.display = "block";
    }
};

const filePickBtn = document.getElementById("filePickBtn");
const videoFilePick = document.getElementById("videoFilePick");
const watchVideo = document.getElementById("watchVideo");
const watchFilePicker = document.getElementById("watchFilePicker");

if(filePickBtn) filePickBtn.onclick = () => videoFilePick.click();
if(videoFilePick) {
    videoFilePick.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            watchFilePicker.style.display = "none";
            watchVideo.src = URL.createObjectURL(file);
            watchVideo.style.display = "block";
        }
    };
}

/* =========================================================================
   8. HARDWARE MULTIMEDIA MODIFIERS & UTILITIES
   ========================================================================= */
let micOn = true;
micBtn.onclick = () => {
    micOn = !micOn;
    localStream.getAudioTracks().forEach(t => t.enabled = micOn);
    micBtn.classList.toggle("off", !micOn);
    localBars.classList.toggle("off", !micOn);
};

let camOn = true;
camBtn.onclick = () => {
    camOn = !camOn;
    localStream.getVideoTracks().forEach(t => t.enabled = camOn);
    camBtn.classList.toggle("off", !camOn);
    localOff.style.display = camOn ? "none" : "flex";
};

roomCodeBtn.onclick = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Room link copied to clipboard! 📋");
};

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

const reactBtn = document.getElementById("reactBtn");
const emojisList = ["🍿", "🔥", "😂", "👏", "🎉"];
if(reactBtn) {
    reactBtn.onclick = () => {
        const node = document.createElement("div");
        node.className = "floatEmoji";
        node.innerText = emojisList[Math.floor(Math.random() * emojisList.length)];
        node.style.left = (20 + Math.random() * 60) + "%";
        node.style.bottom = "80px";
        document.body.appendChild(node);
        setTimeout(() => node.remove(), 2200);
    };
}

const leaveApp = () => { window.location.href = "home.html"; };
if(leaveBtn) leaveBtn.onclick = leaveApp;
if(endCallBtn) endCallBtn.onclick = () => { alert("Call Ended"); leaveApp(); };