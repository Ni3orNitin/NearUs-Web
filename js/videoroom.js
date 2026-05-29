// import { database } from "./firebase.js";
// import { ref, set, onValue, push, onChildAdded, runTransaction, onDisconnect } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// /* =========================================================================
//    1. DOM ELEMENT BINDINGS
//    ========================================================================= */
// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
// const localOff = document.getElementById("localOff");
// const localRoleTag = document.getElementById("localRoleTag");

// const remoteCard = document.getElementById("remoteCard"); 
// const remoteWaiting = document.getElementById("remoteWaiting");
// const remoteOverlay = document.getElementById("remoteOverlay");
// const remoteUserLabel = document.getElementById("remoteUserLabel");
// const waitRoomCodeDisplay = document.getElementById("waitRoomCodeDisplay");

// const localBars = document.getElementById("localBars");
// const remoteBars = document.getElementById("remoteBars");

// const activityWindow = document.getElementById("activityWindow");
// const idlePane = document.getElementById("idlePane");
// const screenPane = document.getElementById("screenPane");
// const whiteboardPane = document.getElementById("whiteboardPane");
// const youtubePane = document.getElementById("youtubePane");
// const watchPane = document.getElementById("watchPane");
// const gamesPane = document.getElementById("gamesPane");

// const roomCodeBtn = document.getElementById("roomCodeBtn");
// const leaveBtn = document.getElementById("leaveBtn");
// const endCallBtn = document.getElementById("endCallBtn");
// const micBtn = document.getElementById("micBtn");
// const camBtn = document.getElementById("camBtn");
// const toast = document.getElementById("toast");

// // Live Chat Bindings
// const chatPanel = document.getElementById("chatPanel");
// const chatMessages = document.getElementById("chatMessages");
// const chatInput = document.getElementById("chatInput");
// const sendChatBtn = document.getElementById("sendChatBtn");
// const closeChatBtn = document.getElementById("closeChatBtn");
// const toggleChatPanelBtn = document.getElementById("toggleChatPanelBtn");

// /* =========================================================================
//    2. CONFIGURATION & STATE MANAGEMENT
//    ========================================================================= */
// const params = new URLSearchParams(window.location.search);
// const roomId = params.get("room") || "NUS8921";
// const myClientId = Math.random().toString(36).substring(2, 9); 

// let myRole = null; 

// if(roomCodeBtn) {
//     roomCodeBtn.innerHTML = `
//         <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
//           <rect x="9" y="9" width="13" height="13" rx="2"/>
//           <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
//         </svg> ${roomId}`;
// }
// if (waitRoomCodeDisplay) {
//     waitRoomCodeDisplay.innerText = `Share room code: ${roomId}`;
// }

// let localStream = null;
// let peerConnection = null;

// const servers = {
//     iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun1.l.google.com:19302" },
//         { urls: "stun:stun2.l.google.com:19302" },
//         { urls: "stun:stun3.l.google.com:19302" },
//         { urls: "stun:stun4.l.google.com:19302" },
//         { urls: "stun:stun.ekiga.net" },
//         { urls: "stun:stun.ideasip.com" },
//         { urls: "stun:stun.rixtelecom.se" },
//         { urls: "stun:stun.schlund.de" },
//         { urls: "stun:stun.twt.it" }
//     ],
//     iceCandidatePoolSize: 10
// };

// const roomRef = ref(database, `rooms/${roomId}/calls`);
// const usersRef = ref(database, `rooms/${roomId}/users`);
// const iceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates`);
// const chatRef = ref(database, `rooms/${roomId}/chat`);
// const ytSyncRef = ref(database, `rooms/${roomId}/youtubeSync`);

// /* =========================================================================
//    3. LIVE TEXT CHAT REPLICATION ENGINE
//    ========================================================================= */
// toggleChatPanelBtn.onclick = () => {
//     chatPanel.classList.add("open");
//     toggleChatPanelBtn.style.display = "none";
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// };
// closeChatBtn.onclick = () => {
//     chatPanel.classList.remove("open");
//     toggleChatPanelBtn.style.display = "flex";
// };

// function emitChatMessage() {
//     const text = chatInput.value.trim();
//     if (!text) return;

//     push(chatRef, {
//         sender: myClientId,
//         message: text,
//         timestamp: Date.now()
//     });
//     chatInput.value = "";
// }

// sendChatBtn.onclick = emitChatMessage;
// chatInput.onkeydown = (e) => { if (e.key === "Enter") emitChatMessage(); };

// onChildAdded(chatRef, (snapshot) => {
//     const data = snapshot.val();
//     if (!data) return;

//     const msgElement = document.createElement("div");
//     const isMe = data.sender === myClientId;
    
//     msgElement.className = `msgBlock ${isMe ? "outgoing" : "incoming"}`;
//     msgElement.innerText = data.message;
    
//     chatMessages.appendChild(msgElement);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// /* =========================================================================
//    4. ROLE SELECTION & WEBRTC SIGNALING ENGINE
//    ========================================================================= */
// async function initializeRoomPresence() {
//     runTransaction(usersRef, (currentUsers) => {
//         if (!currentUsers) return { host: myClientId, guest: "" };
//         if (!currentUsers.host) {
//             currentUsers.host = myClientId;
//         } else if (!currentUsers.guest && currentUsers.host !== myClientId) {
//             currentUsers.guest = myClientId;
//         }
//         return currentUsers;
//     }).then(async (result) => {
//         const users = result.snapshot.val();
        
//         if (users.host === myClientId) {
//             myRole = "Host";
//             localRoleTag.innerText = "Host";
//             localRoleTag.style.background = "rgba(124, 58, 237, 0.7)";
//         } else if (users.guest === myClientId) {
//             myRole = "Guest";
//             localRoleTag.innerText = "Guest";
//             localRoleTag.style.background = "rgba(16, 185, 129, 0.7)";
//         } else {
//             myRole = "Spectator";
//             localRoleTag.innerText = "Viewer";
//         }

//         if (myRole === "Host") {
//             onDisconnect(ref(database, `rooms/${roomId}/users/host`)).set("");
//             onDisconnect(roomRef).set(null);
//             onDisconnect(iceCandidatesRef).set(null);
//             onDisconnect(ytSyncRef).set(null); 
//         } else if (myRole === "Guest") {
//             onDisconnect(ref(database, `rooms/${roomId}/users/guest`)).set("");
//         }

//         // Only launch tracking channels if user has media execution rights
//         if (myRole === "Host" || myRole === "Guest") {
//             await startCall();
//         }
//     });
// }

// async function startCall() {
//     try {
//         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localVideo.srcObject = localStream;

//         peerConnection = new RTCPeerConnection(servers);
//         localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

//         peerConnection.ontrack = (event) => {
//             console.log("Remote track detected:", event.streams);
//             if (event.streams && event.streams[0]) {
//                 remoteVideo.srcObject = event.streams[0];
//                 if (remoteWaiting) remoteWaiting.style.display = "none";
//                 if (remoteOverlay) remoteOverlay.style.display = "flex";
//                 if (remoteUserLabel) {
//                     remoteUserLabel.innerText = (myRole === "Host") ? "Guest User" : "Host User";
//                 }
//                 console.log("WebRTC Remote Stream successfully mounted.");
//             }
//         };

//         peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//                 push(iceCandidatesRef, {
//                     candidate: event.candidate.toJSON(),
//                     senderRole: myRole
//                 });
//             }
//         };

//         executeWebRTCHandshake();

//     } catch (error) {
//         console.error("Hardware stream collection failed:", error);
//         showToast("Camera/Microphone tracks access denied.");
//     }
// }

// async function executeWebRTCHandshake() {
//     if (myRole === "Host") {
//         const offer = await peerConnection.createOffer();
//         await peerConnection.setLocalDescription(offer);
//         await set(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });

//         onValue(roomRef, async (snapshot) => {
//             const data = snapshot.val();
//             if (data && data.answer && !peerConnection.currentRemoteDescription) {
//                 console.log("Host processing remote session description...");
//                 await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
//             }
//         });

//     } else if (myRole === "Guest") {
//         onValue(roomRef, async (snapshot) => {
//             const data = snapshot.val();
//             if (!data) return;

//             if (data.offer && !peerConnection.currentRemoteDescription) {
//                 console.log("Guest processing remote session description...");
//                 await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
//                 const answer = await peerConnection.createAnswer();
//                 await peerConnection.setLocalDescription(answer);
                
//                 // FIXED: Isolated path update avoids wiping or cross-triggering synchronization flags
//                 const answerRef = ref(database, `rooms/${roomId}/calls/answer`);
//                 await set(answerRef, { type: answer.type, sdp: answer.sdp });
//             }
//         });
//     }

//     onChildAdded(iceCandidatesRef, (snapshot) => {
//         const item = snapshot.val();
//         if (item && item.senderRole !== myRole) {
//             if (peerConnection.remoteDescription) {
//                 peerConnection.addIceCandidate(new RTCIceCandidate(item.candidate))
//                     .catch(e => console.error("Candidate injection failure:", e));
//             }
//         }
//     });
// }

// initializeRoomPresence();

// /* =========================================================================
//    5. DYNAMIC INTERFACE TABS & PANE TOGGLE ACTIONS
//    ========================================================================= */
// const tabs = document.querySelectorAll(".featTab");
// const panes = [idlePane, screenPane, whiteboardPane, youtubePane, watchPane, gamesPane];

// const actionButtonMap = {
//     "screenBtn": "screen",
//     "wbBtn": "whiteboard",
//     "ytBtn": "youtube",
//     "gamesBtn": "games"
// };

// Object.entries(actionButtonMap).forEach(([btnId, activityName]) => {
//     const btn = document.getElementById(btnId);
//     if(btn) btn.addEventListener("click", () => switchActivity(activityName));
// });

// tabs.forEach(tab => {
//     tab.addEventListener("click", () => {
//         switchActivity(tab.getAttribute("data-activity"));
//     });
// });

// function switchActivity(activityName) {
//     panes.forEach(pane => { if(pane) pane.classList.remove("active"); });
//     tabs.forEach(t => t.classList.remove("active"));
//     Object.keys(actionButtonMap).forEach(id => {
//         const el = document.getElementById(id);
//         if(el) el.classList.remove("active");
//     });

//     const activePane = document.getElementById(`${activityName}Pane`);
//     const activeTab = document.getElementById(`tab-${activityName}`);
    
//     if (activePane) activePane.classList.add("active");
//     if (activeTab) activeTab.classList.add("active");

//     const relatedBtnId = Object.keys(actionButtonMap).find(key => actionButtonMap[key] === activityName);
//     if(relatedBtnId) document.getElementById(relatedBtnId).classList.add("active");

//     if (activityName === "whiteboard") initWhiteboardEngine();
//     if (activityName === "youtube") initYouTubeSyncEngine(); 
//     if (activityName === "games") launchGameZoneUI();
// }

// function launchGameZoneUI() {
//     gamesPane.innerHTML = `
//         <div class="gamesUI" style="padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; box-sizing: border-box; overflow-y: auto;">
//             <h1 class="gamesTitle" style="font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 30px; background: linear-gradient(135deg, #c084fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🎮 Game Zone</h1>
//             <div class="gamesGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; width: 100%; max-width: 800px;">
//                 <div class="gameCard" style="background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
//                     <div style="font-size: 40px;">❌</div>
//                     <h2 style="font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;">Tic Tac Toe</h2>
//                     <p style="font-size: 12px; color: var(--muted); line-height: 1.4;">Play live with your room peer.</p>
//                     <button class="filePickBtn" id="startTicTacToe" style="margin-top: auto; width: 100%; padding: 10px;">Play Now</button>
//                 </div>
//             </div>
//         </div>`;

//     document.getElementById("startTicTacToe").onclick = () => {
//         gamesPane.innerHTML = `<iframe src="games/tictactoe.html?room=${roomId}" style="width:100%; height:100%; border:none; background:#04080f; display:block;"></iframe>`;
//     };
// }

// /* =========================================================================
//    6. YOUTUBE SHARED PLAYBACK SYNCHRONIZATION ENGINE
//    ========================================================================= */
// let ytPlayer = null;
// let isYtApiLoaded = false;
// let isUpdatingFromFirebase = false; 

// function initYouTubeSyncEngine() {
//     if (isYtApiLoaded) return;
//     isYtApiLoaded = true;

//     if (!window.YT) {
//         const tag = document.createElement('script');
//         tag.src = "https://www.youtube.com/iframe_api";
//         const firstScriptTag = document.getElementsByTagName('script')[0];
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//     } else {
//         buildYTIframeInstance();
//     }

//     window.onYouTubeIframeAPIReady = () => {
//         buildYTIframeInstance();
//     };
// }

// function buildYTIframeInstance() {
//     if (ytPlayer) return;
//     ytPlayer = new YT.Player('ytPlayer', {
//         height: '100%',
//         width: '100%',
//         videoId: '', 
//         playerVars: {
//             'playsinline': 1,
//             'controls': 1,
//             'rel': 0
//         },
//         events: {
//             'onStateChange': handlePlayerStateChange
//         }
//     });
//     listenToFirebaseYTSync();
// }

// function handlePlayerStateChange(event) {
//     if (isUpdatingFromFirebase || !ytPlayer) return;

//     const currentState = event.data;
//     const currentTime = ytPlayer.getCurrentTime();

//     if (currentState === YT.PlayerState.PLAYING || currentState === YT.PlayerState.PAUSED) {
//         set(ytSyncRef, {
//             sender: myClientId,
//             state: currentState,
//             time: currentTime,
//             videoId: ytPlayer.getVideoData().video_id,
//             timestamp: Date.now()
//         });
//     }
// }

// function listenToFirebaseYTSync() {
//     onValue(ytSyncRef, (snapshot) => {
//         const data = snapshot.val();
//         if (!data || data.sender === myClientId || !ytPlayer) return;

//         isUpdatingFromFirebase = true; 
//         const currentVideoId = ytPlayer.getVideoData().video_id;

//         if (data.videoId && data.videoId !== currentVideoId) {
//             document.getElementById("ytPlaceholderDiv").style.display = "none";
//             document.getElementById("ytPlayerContainer").style.display = "block";
//             ytPlayer.loadVideoById(data.videoId, data.time);
//         }

//         const localTime = ytPlayer.getCurrentTime();
//         if (Math.abs(localTime - data.time) > 2) {
//             ytPlayer.seekTo(data.time, true);
//         }

//         if (data.state === YT.PlayerState.PLAYING) {
//             ytPlayer.playVideo();
//         } else if (data.state === YT.PlayerState.PAUSED) {
//             ytPlayer.pauseVideo();
//         }

//         setTimeout(() => { isUpdatingFromFirebase = false; }, 600);
//     });
// }

// document.getElementById("ytLoadBtn").onclick = () => {
//     const urlVal = document.getElementById("ytUrl").value.trim();
//     let videoId = urlVal;
    
//     if(urlVal.includes("v=")) videoId = urlVal.split("v=")[1].split("&")[0];
//     else if(urlVal.includes("youtu.be/")) videoId = urlVal.split("youtu.be/")[1].split("?")[0];

//     if(videoId && ytPlayer) {
//         document.getElementById("ytPlaceholderDiv").style.display = "none";
//         document.getElementById("ytPlayerContainer").style.display = "block";
        
//         set(ytSyncRef, {
//             sender: myClientId,
//             state: YT.PlayerState.PLAYING,
//             time: 0,
//             videoId: videoId,
//             timestamp: Date.now()
//         });

//         ytPlayer.loadVideoById(videoId, 0);
//     }
// };

// /* =========================================================================
//    7. WHITEBOARD DRAWING ENGINE
//    ========================================================================= */
// let isWbInitialized = false;
// function initWhiteboardEngine() {
//     if (isWbInitialized) return;
//     isWbInitialized = true;

//     const canvas = document.getElementById("wbCanvas");
//     const ctx = canvas.getContext("2d");
    
//     canvas.width = canvas.parentElement.clientWidth;
//     canvas.height = canvas.parentElement.clientHeight;

//     let drawing = false;
//     let strokeColor = "#000000";
//     let strokeSize = 4;
//     let toolMode = "pen";

//     const colors = ["#000000", "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#a855f7"];
//     const colorsContainer = document.getElementById("wbColors");
//     colorsContainer.innerHTML = "";
    
//     colors.forEach((color, idx) => {
//         const dot = document.createElement("div");
//         dot.className = `colorDot ${idx === 0 ? "selected" : ""}`;
//         dot.style.backgroundColor = color;
//         dot.addEventListener("click", () => {
//             document.querySelectorAll(".colorDot").forEach(d => d.classList.remove("selected"));
//             dot.classList.add("selected");
//             strokeColor = color;
//             toolMode = "pen";
//             document.getElementById("wbPen").classList.add("active");
//             document.getElementById("wbEraser").classList.remove("active");
//         });
//         colorsContainer.appendChild(dot);
//     });

//     document.getElementById("wbPen").onclick = () => {
//         toolMode = "pen";
//         document.getElementById("wbPen").classList.add("active");
//         document.getElementById("wbEraser").classList.remove("active");
//     };
//     document.getElementById("wbEraser").onclick = () => {
//         toolMode = "eraser";
//         document.getElementById("wbEraser").classList.add("active");
//         document.getElementById("wbPen").classList.remove("active");
//     };
//     document.getElementById("wbSizeSlider").oninput = (e) => strokeSize = e.target.value;
//     document.getElementById("wbClearBtn").onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

//     canvas.addEventListener("mousedown", () => drawing = true);
//     canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
//     canvas.addEventListener("mousemove", (e) => {
//         if (!drawing) return;
//         const rect = canvas.getBoundingClientRect();
//         ctx.lineWidth = strokeSize;
//         ctx.lineCap = "round";
//         ctx.strokeStyle = (toolMode === "eraser") ? "#FFFFFF" : strokeColor;

//         ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
//     });
// }

// /* =========================================================================
//    8. WATCH PARTY / FILE DELEGATIONS
//    ========================================================================= */
// const filePickBtn = document.getElementById("filePickBtn");
// const videoFilePick = document.getElementById("videoFilePick");
// const watchVideo = document.getElementById("watchVideo");
// const watchFilePicker = document.getElementById("watchFilePicker");

// if(filePickBtn) filePickBtn.onclick = () => videoFilePick.click();
// if(videoFilePick) {
//     videoFilePick.onchange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             watchFilePicker.style.display = "none";
//             watchVideo.src = URL.createObjectURL(file);
//             watchVideo.style.display = "block";
//         }
//     };
// }

// /* =========================================================================
//    9. HARDWARE MULTIMEDIA MODIFIERS & UTILITIES
//    ========================================================================= */
// let micOn = true;
// micBtn.onclick = () => {
//     micOn = !micOn;
//     if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = micOn);
//     micBtn.classList.toggle("off", !micOn);
//     localBars.classList.toggle("off", !micOn);
// };

// let camOn = true;
// camBtn.onclick = () => {
//     camOn = !camOn;
//     if (localStream) localStream.getVideoTracks().forEach(t => t.enabled = camOn);
//     camBtn.classList.toggle("off", !camOn);
//     localOff.style.display = camOn ? "none" : "flex";
// };

// roomCodeBtn.onclick = async () => {
//     await navigator.clipboard.writeText(window.location.href);
//     showToast("Room link copied to clipboard! 📋");
// };

// function showToast(msg) {
//     toast.innerText = msg;
//     toast.classList.add("show");
//     setTimeout(() => toast.classList.remove("show"), 2500);
// }

// const reactBtn = document.getElementById("reactBtn");
// const emojisList = ["🍿", "🔥", "😂", "👏", "🎉"];
// if(reactBtn) {
//     reactBtn.onclick = () => {
//         const node = document.createElement("div");
//         node.className = "floatEmoji";
//         node.innerText = emojisList[Math.floor(Math.random() * emojisList.length)];
//         node.style.left = (20 + Math.random() * 60) + "%";
//         node.style.bottom = "80px";
//         document.body.appendChild(node);
//         setTimeout(() => node.remove(), 2200);
//     };
// }

// const leaveApp = () => { window.location.href = "home.html"; };
// if(leaveBtn) leaveBtn.onclick = leaveApp;
// if(endCallBtn) endCallBtn.onclick = () => { alert("Call Ended"); leaveApp(); };








import { database } from "./firebase.js";
import { ref, set, onValue, push, onChildAdded, runTransaction, onDisconnect } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

/* =========================================================================
   1. DOM ELEMENT BINDINGS
   ========================================================================= */
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const localOff = document.getElementById("localOff");
const localRoleTag = document.getElementById("localRoleTag");

const remoteCard = document.getElementById("remoteCard"); 
const remoteWaiting = document.getElementById("remoteWaiting");
const remoteOverlay = document.getElementById("remoteOverlay");
const remoteUserLabel = document.getElementById("remoteUserLabel");
const waitRoomCodeDisplay = document.getElementById("waitRoomCodeDisplay");

const localBars = document.getElementById("localBars");
const remoteBars = document.getElementById("remoteBars");

const activityWindow = document.getElementById("activityWindow");
const idlePane = document.getElementById("idlePane");
const screenPane = document.getElementById("screenPane");
const whiteboardPane = document.getElementById("whiteboardPane");
const youtubePane = document.getElementById("youtubePane");
const watchPane = document.getElementById("watchPane");
const gamesPane = document.getElementById("gamesPane");

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
const myClientId = Math.random().toString(36).substring(2, 9); 

let myRole = null; 

if(roomCodeBtn) {
    roomCodeBtn.innerHTML = `
        <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
        </svg> ${roomId}`;
}
if (waitRoomCodeDisplay) {
    waitRoomCodeDisplay.innerText = `Share room code: ${roomId}`;
}

let localStream = null;
let peerConnection = null;
let screenStream = null; 

const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    iceCandidatePoolSize: 10
};

// Database Signaling Targets
const roomRef = ref(database, `rooms/${roomId}/calls`);
const usersRef = ref(database, `rooms/${roomId}/users`);
const iceCandidatesRef = ref(database, `rooms/${roomId}/iceCandidates`);
const chatRef = ref(database, `rooms/${roomId}/chat`);
const ytSyncRef = ref(database, `rooms/${roomId}/youtubeSync`);

// Interactivity Workspace Synchronization Paths
const activitySyncRef = ref(database, `rooms/${roomId}/activeTab`);
const boardDrawRef = ref(database, `rooms/${roomId}/boardDrawing`);
const watchSyncRef = ref(database, `rooms/${roomId}/watchSync`);

/* =========================================================================
   3. LIVE TEXT CHAT REPLICATION ENGINE
   ========================================================================= */
toggleChatPanelBtn.onclick = () => {
    chatPanel.classList.add("open");
    toggleChatPanelBtn.style.display = "none";
    chatMessages.scrollTop = chatMessages.scrollHeight;
};
closeChatBtn.onclick = () => {
    chatPanel.classList.remove("open");
    toggleChatPanelBtn.style.display = "flex";
};

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

onChildAdded(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const msgElement = document.createElement("div");
    const isMe = data.sender === myClientId;
    
    msgElement.className = `msgBlock ${isMe ? "outgoing" : "incoming"}`;
    msgElement.innerText = data.message;
    
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

/* =========================================================================
   4. ROLE SELECTION & WEBRTC SIGNALING ENGINE
   ========================================================================= */
async function initializeRoomPresence() {
    runTransaction(usersRef, (currentUsers) => {
        if (!currentUsers) return { host: myClientId, guest: "" };
        if (!currentUsers.host) {
            currentUsers.host = myClientId;
        } else if (!currentUsers.guest && currentUsers.host !== myClientId) {
            currentUsers.guest = myClientId;
        }
        return currentUsers;
    }).then(async (result) => {
        const users = result.snapshot.val();
        
        if (users.host === myClientId) {
            myRole = "Host";
            localRoleTag.innerText = "Host";
            localRoleTag.style.background = "rgba(124, 58, 237, 0.7)";
        } else if (users.guest === myClientId) {
            myRole = "Guest";
            localRoleTag.innerText = "Guest";
            localRoleTag.style.background = "rgba(16, 185, 129, 0.7)";
        } else {
            myRole = "Spectator";
            localRoleTag.innerText = "Viewer";
        }

        if (myRole === "Host") {
            onDisconnect(ref(database, `rooms/${roomId}/users/host`)).set("");
            onDisconnect(roomRef).set(null);
            onDisconnect(iceCandidatesRef).set(null);
            onDisconnect(ytSyncRef).set(null); 
            onDisconnect(activitySyncRef).set(null);
            onDisconnect(boardDrawRef).set(null);
            onDisconnect(watchSyncRef).set(null);
        } else if (myRole === "Guest") {
            onDisconnect(ref(database, `rooms/${roomId}/users/guest`)).set("");
        }

        if (myRole === "Host" || myRole === "Guest") {
            await startCall();
        }
        
        // Connect workspace pane distribution listener
        listenToActivitySync();
    });
}

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        peerConnection = new RTCPeerConnection(servers);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
                if (remoteWaiting) remoteWaiting.style.display = "none";
                if (remoteOverlay) remoteOverlay.style.display = "flex";
                if (remoteUserLabel) {
                    remoteUserLabel.innerText = (myRole === "Host") ? "Guest User" : "Host User";
                }
            }
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                push(iceCandidatesRef, {
                    candidate: event.candidate.toJSON(),
                    senderRole: myRole
                });
            }
        };

        executeWebRTCHandshake();

    } catch (error) {
        console.error("Hardware stream collection failed:", error);
    }
}

async function executeWebRTCHandshake() {
    if (myRole === "Host") {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await set(roomRef, { offer: { type: offer.type, sdp: offer.sdp } });

        onValue(roomRef, async (snapshot) => {
            const data = snapshot.val();
            if (data && data.answer && !peerConnection.currentRemoteDescription) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });

    } else if (myRole === "Guest") {
        onValue(roomRef, async (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            if (data.offer && !peerConnection.currentRemoteDescription) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                
                const answerRef = ref(database, `rooms/${roomId}/calls/answer`);
                await set(answerRef, { type: answer.type, sdp: answer.sdp });
            }
        });
    }

    onChildAdded(iceCandidatesRef, (snapshot) => {
        const item = snapshot.val();
        if (item && item.senderRole !== myRole) {
            if (peerConnection.remoteDescription) {
                peerConnection.addIceCandidate(new RTCIceCandidate(item.candidate))
                    .catch(e => console.error("Candidate injection failure:", e));
            }
        }
    });
}

initializeRoomPresence();

/* =========================================================================
   5. DYNAMIC INTERFACE TABS & PANE TOGGLE ACTIONS (SYNCED)
   ========================================================================= */
const tabs = document.querySelectorAll(".featTab");
const panes = [idlePane, screenPane, whiteboardPane, youtubePane, watchPane, gamesPane];

const actionButtonMap = {
    "screenBtn": "screen",
    "wbBtn": "whiteboard",
    "ytBtn": "youtube",
    "gamesBtn": "games"
};

Object.entries(actionButtonMap).forEach(([btnId, activityName]) => {
    const btn = document.getElementById(btnId);
    if(btn) btn.addEventListener("click", () => triggerActivityChange(activityName));
});

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        triggerActivityChange(tab.getAttribute("data-activity"));
    });
});

function triggerActivityChange(activityName) {
    set(activitySyncRef, {
        activeTab: activityName,
        sender: myClientId
    });
    switchActivity(activityName);
}

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
    if (activityName === "youtube") initYouTubeSyncEngine(); 
    if (activityName === "games") launchGameZoneUI();
    if (activityName === "screen") initScreenShareEngine();
}

function listenToActivitySync() {
    onValue(activitySyncRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.sender !== myClientId) {
            switchActivity(data.activeTab);
        }
    });
}

/* =========================================================================
   5b. GAMES ZONE INJECTION HUB
   ========================================================================= */
function launchGameZoneUI() {
    // Render the multiplayer selection hub dashboard cleanly inside your games pane layout
    gamesPane.innerHTML = `
        <div class="gamesUI" style="padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; height: 100%; width: 100%; box-sizing: border-box; overflow-y: auto; background: #04080f;">
            <h1 class="gamesTitle" style="font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 30px; background: linear-gradient(135deg, #c084fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 20px rgba(129, 140, 248, 0.2);">🎮 Game Zone</h1>
            
            <div class="gamesGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; width: 100%; max-width: 900px;">
                
                <div class="gameCard" style="background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; transition: border-color 0.2s;">
                    <div style="font-size: 40px;">❌</div>
                    <h2 style="font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff;">Tic Tac Toe</h2>
                    <p style="font-size: 12px; color: var(--muted); line-height: 1.4;">Classic 3-in-a-row match with your peer.</p>
                    <button class="filePickBtn" id="playTicTacToe" style="margin-top: auto; width: 100%; padding: 10px;">Play Now</button>
                </div>

                <div class="gameCard" style="background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                    <div style="font-size: 40px;">👑</div>
                    <h2 style="font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff;">Multiplayer Chess</h2>
                    <p style="font-size: 12px; color: var(--muted); line-height: 1.4;">Go head-to-head in a deep strategic battle.</p>
                    <button class="filePickBtn" id="playChess" style="margin-top: auto; width: 100%; padding: 10px; background: #8b5cf6;">Play Now</button>
                </div>

                <div class="gameCard" style="background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                    <div style="font-size: 40px;">🃏</div>
                    <h2 style="font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff;">Uno Cards</h2>
                    <p style="font-size: 12px; color: var(--muted); line-height: 1.4;">Match colors, drop Wilds, and clear your hand.</p>
                    <button class="filePickBtn" id="playUno" style="margin-top: auto; width: 100%; padding: 10px; background: #ec4899;">Play Now</button>
                </div>

                <div class="gameCard" style="background: var(--card2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                    <div style="font-size: 40px;">🐍</div>
                    <h2 style="font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff;">Co-op Snake</h2>
                    <p style="font-size: 12px; color: var(--muted); line-height: 1.4;">Eat food together without crashing into each other.</p>
                    <button class="filePickBtn" id="playSnake" style="margin-top: auto; width: 100%; padding: 10px; background: #10b981;">Play Now</button>
                </div>

            </div>
        </div>`;

    // Bind your newly created game paths directly to frame loading handlers
    document.getElementById("playTicTacToe").onclick = () => loadGameFrame("tictactoe.html");
    document.getElementById("playChess").onclick      = () => loadGameFrame("chess.html");
    document.getElementById("playUno").onclick        = () => loadGameFrame("uno.html");
    document.getElementById("playSnake").onclick      = () => loadGameFrame("snake.html");
}

function loadGameFrame(fileName) {
    // Mount game scripts securely via frame tags using global shared parameter flags
    gamesPane.innerHTML = `
        <div style="width: 100%; height: 100%; position: relative; background: #04080f;">
            <button id="exitGameBtn" style="position: absolute; top: 10px; left: 10px; z-index: 9999; padding: 6px 12px; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #fda4af; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 700; font-family: 'DM Sans', sans-serif;">↩ Leave Game</button>
            <iframe src="games/${fileName}?room=${roomId}" style="width:100%; height:100%; border:none; background:#04080f; display:block;"></iframe>
        </div>`;
    
    // Add event listener to returning layout control seamlessly to selector board dashboard
    document.getElementById("exitGameBtn").onclick = () => {
        launchGameZoneUI();
    };
}

/* =========================================================================
   5c. LOCAL SCREEN SHARING CAPTURE ENGINE
   ========================================================================= */
async function initScreenShareEngine() {
    const screenVideo = document.getElementById("screenVideo");
    if (!screenVideo || screenVideo.srcObject) return;

    try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        screenVideo.srcObject = screenStream;
        
        screenStream.getVideoTracks()[0].onended = () => {
            screenVideo.srcObject = null;
            triggerActivityChange("idle");
        };
    } catch (err) {
        console.warn("Screen display capture rejected:", err);
    }
}

/* =========================================================================
   6. YOUTUBE SHARED PLAYBACK SYNCHRONIZATION ENGINE
   ========================================================================= */
let ytPlayer = null;
let isYtApiLoaded = false;
let isUpdatingFromFirebase = false; 

function initYouTubeSyncEngine() {
    if (isYtApiLoaded) return;
    isYtApiLoaded = true;

    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
        buildYTIframeInstance();
    }

    window.onYouTubeIframeAPIReady = () => {
        buildYTIframeInstance();
    };
}

function buildYTIframeInstance() {
    if (ytPlayer) return;
    ytPlayer = new YT.Player('ytPlayer', {
        height: '100%',
        width: '100%',
        videoId: '', 
        playerVars: { 'playsinline': 1, 'controls': 1, 'rel': 0 },
        events: { 'onStateChange': handlePlayerStateChange }
    });
    listenToFirebaseYTSync();
}

function handlePlayerStateChange(event) {
    if (isUpdatingFromFirebase || !ytPlayer) return;
    const currentState = event.data;
    const currentTime = ytPlayer.getCurrentTime();

    if (currentState === YT.PlayerState.PLAYING || currentState === YT.PlayerState.PAUSED) {
        set(ytSyncRef, {
            sender: myClientId,
            state: currentState,
            time: currentTime,
            videoId: ytPlayer.getVideoData().video_id,
            timestamp: Date.now()
        });
    }
}

function listenToFirebaseYTSync() {
    onValue(ytSyncRef, (snapshot) => {
        const data = snapshot.val();
        if (!data || data.sender === myClientId || !ytPlayer) return;

        isUpdatingFromFirebase = true; 
        const currentVideoId = ytPlayer.getVideoData().video_id;

        if (data.videoId && data.videoId !== currentVideoId) {
            document.getElementById("ytPlaceholderDiv").style.display = "none";
            document.getElementById("ytPlayerContainer").style.display = "block";
            ytPlayer.loadVideoById(data.videoId, data.time);
        }

        const localTime = ytPlayer.getCurrentTime();
        if (Math.abs(localTime - data.time) > 2) {
            ytPlayer.seekTo(data.time, true);
        }

        if (data.state === YT.PlayerState.PLAYING) {
            ytPlayer.playVideo();
        } else if (data.state === YT.PlayerState.PAUSED) {
            ytPlayer.pauseVideo();
        }

        setTimeout(() => { isUpdatingFromFirebase = false; }, 600);
    });
}

document.getElementById("ytLoadBtn").onclick = () => {
    const urlVal = document.getElementById("ytUrl").value.trim();
    let videoId = urlVal;
    
    if(urlVal.includes("v=")) videoId = urlVal.split("v=")[1].split("&")[0];
    else if(urlVal.includes("youtu.be/")) videoId = urlVal.split("youtu.be/")[1].split("?")[0];

    if(videoId && ytPlayer) {
        document.getElementById("ytPlaceholderDiv").style.display = "none";
        document.getElementById("ytPlayerContainer").style.display = "block";
        
        set(ytSyncRef, {
            sender: myClientId,
            state: YT.PlayerState.PLAYING,
            time: 0,
            videoId: videoId,
            timestamp: Date.now()
        });
        ytPlayer.loadVideoById(videoId, 0);
    }
};

/* =========================================================================
   7. WHITEBOARD DRAWING ENGINE (VECTOR SYNCED)
   ========================================================================= */
let isWbInitialized = false;
function initWhiteboardEngine() {
    if (isWbInitialized) return;
    isWbInitialized = true;

    const canvas = document.getElementById("wbCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = canvas.parentElement.clientWidth || 800;
    canvas.height = canvas.parentElement.clientHeight || 500;

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
        });
        colorsContainer.appendChild(dot);
    });

    document.getElementById("wbPen").onclick = () => { toolMode = "pen"; };
    document.getElementById("wbEraser").onclick = () => { toolMode = "eraser"; };
    document.getElementById("wbSizeSlider").oninput = (e) => strokeSize = e.target.value;
    
    document.getElementById("wbClearBtn").onclick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        set(boardDrawRef, { clear: Date.now() });
    };

    let lastX = 0, lastY = 0;

    canvas.addEventListener("mousedown", (e) => {
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    });
    
    canvas.addEventListener("mouseup", () => drawing = false);
    canvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const drawData = {
            fromX: lastX,
            fromY: lastY,
            toX: currentX,
            toY: currentY,
            color: (toolMode === "eraser") ? "#FFFFFF" : strokeColor,
            size: strokeSize,
            sender: myClientId
        };

        drawSegment(ctx, drawData);
        push(boardDrawRef, drawData);

        lastX = currentX;
        lastY = currentY;
    });

    onChildAdded(boardDrawRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;
        if (data.clear) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else if (data.sender !== myClientId) {
            drawSegment(ctx, data);
        }
    });
}

function drawSegment(context, data) {
    context.beginPath();
    context.strokeStyle = data.color;
    context.lineWidth = data.size;
    context.lineCap = "round";
    context.moveTo(data.fromX, data.fromY);
    context.lineTo(data.toX, data.toY);
    context.stroke();
    context.closePath();
}

/* =========================================================================
   8. WATCH PARTY ENGINE (LOCAL FILE INPUT FIXED)
   ========================================================================= */
const filePickBtn = document.getElementById("filePickBtn");
const videoFilePick = document.getElementById("videoFilePick");
const watchVideo = document.getElementById("watchVideo");
const watchFilePicker = document.getElementById("watchFilePicker");

let localWatchUpdate = false;

if (filePickBtn && videoFilePick) {
    filePickBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        videoFilePick.click();
    };
}

if (videoFilePick) {
    videoFilePick.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const localBlobUrl = URL.createObjectURL(file);
            
            if (watchFilePicker) watchFilePicker.style.display = "none";
            if (watchVideo) {
                watchVideo.src = localBlobUrl;
                watchVideo.style.display = "block";
                watchVideo.load();
                setupWatchPartyListeners();
            }
        }
    };
}

function setupWatchPartyListeners() {
    if (!watchVideo) return;

    watchVideo.onplay = () => {
        if (localWatchUpdate) return;
        set(watchSyncRef, { action: "play", time: watchVideo.currentTime, sender: myClientId });
    };
    watchVideo.onpause = () => {
        if (localWatchUpdate) return;
        set(watchSyncRef, { action: "pause", time: watchVideo.currentTime, sender: myClientId });
    };
    watchVideo.onseeking = () => {
        if (localWatchUpdate) return;
        set(watchSyncRef, { action: "seek", time: watchVideo.currentTime, sender: myClientId });
    };

    onValue(watchSyncRef, (snapshot) => {
        const data = snapshot.val();
        if (!data || data.sender === myClientId) return;

        localWatchUpdate = true;
        if (Math.abs(watchVideo.currentTime - data.time) > 1.5) {
            watchVideo.currentTime = data.time;
        }

        if (data.action === "play" && watchVideo.paused) {
            watchVideo.play().catch(() => {});
        } else if (data.action === "pause" && !watchVideo.paused) {
            watchVideo.pause();
        }
        
        setTimeout(() => { localWatchUpdate = false; }, 300);
    });
}

/* =========================================================================
   9. HARDWARE MULTIMEDIA MODIFIERS & UTILITIES
   ========================================================================= */
let micOn = true;
micBtn.onclick = () => {
    micOn = !micOn;
    if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = micOn);
    micBtn.classList.toggle("off", !micOn);
    localBars.classList.toggle("off", !micOn);
};

let camOn = true;
camBtn.onclick = () => {
    camOn = !camOn;
    if (localStream) localStream.getVideoTracks().forEach(t => t.enabled = camOn);
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