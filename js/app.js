// =======================================
// FIREBASE IMPORTS
// =======================================

import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {

    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {

    getDatabase,
    ref,
    set,
    get,
    push,
    onValue,
    remove

}

from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";


// =======================================
// FIREBASE CONFIG
// =======================================

const firebaseConfig = {

    apiKey: "AIzaSyBl_f2bJEjmdTMbyZpfKXbhE7p87yXtHs4",

    authDomain: "nearus-web.firebaseapp.com",

    databaseURL:
    "https://nearus-web-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "nearus-web",

    storageBucket: "nearus-web.firebasestorage.app",

    messagingSenderId: "920428262831",

    appId: "1:920428262831:web:042c145ca0c5724223ab5a"

};


// =======================================
// INITIALIZE FIREBASE
// =======================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const database = getDatabase(app);


// =======================================
// GLOBAL EXPORTS
// =======================================

window.database = database;

window.firebaseRef = ref;

window.firebaseSet = set;

window.firebaseGet = get;

window.firebasePush = push;

window.firebaseOnValue = onValue;

window.firebaseRemove = remove;


// =======================================
// LOGIN USER
// =======================================

window.loginUser = async function () {

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    if(email === "" || password === ""){

        alert("Please fill all fields");

        return;
    }

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login Successful");

        window.location.href = "home.html";

    }

    catch (error) {

        alert(error.message);

        console.log(error);
    }
};


// =======================================
// REGISTER USER
// =======================================

window.registerUser = async function () {

    const name =
        document.getElementById("registerName").value;

    const email =
        document.getElementById("registerEmail").value;

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if(password !== confirmPassword){

        alert("Passwords do not match");

        return;
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        await set(

            ref(database, "users/" + user.uid),

            {
                name: name,
                email: email,
                uid: user.uid
            }
        );

        alert("Account Created");

        window.location.href = "home.html";

    }

    catch (error) {

        alert(error.message);

        console.log(error);
    }
};


// =======================================
// GOOGLE LOGIN
// =======================================

window.googleLogin = async function () {

    try {

        const result =
            await signInWithPopup(auth, provider);

        const user = result.user;

        await set(

            ref(database, "users/" + user.uid),

            {
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                photo: user.photoURL
            }
        );

        alert("Welcome " + user.displayName);

        window.location.href = "home.html";

    }

    catch (error) {

        console.log(error);

        alert(error.message);
    }
};


// =======================================
// LOGOUT
// =======================================

window.logoutUser = async function () {

    await signOut(auth);

    window.location.href = "login.html";
};


// =======================================
// CREATE ROOM
// =======================================

window.createRoom = async function () {

    const roomName =
        document.getElementById("roomName").value;

    if(roomName === ""){

        alert("Enter Room Name");

        return;
    }

    const roomId =
        "ROOM" +
        Math.floor(Math.random() * 999999);

    await set(

        ref(database, "rooms/" + roomId),

        {

            roomName: roomName,

            roomId: roomId,

            createdAt: Date.now()

        }

    );

    localStorage.setItem(
        "currentRoom",
        roomId
    );

    alert("Room Created");

    window.location.href =
        "videoroom.html?room=" + roomId;
};


// =======================================
// JOIN ROOM
// =======================================

window.joinRoom = async function () {

    const roomId =
        document.getElementById("joinRoomId").value;

    if(roomId === ""){

        alert("Enter Room ID");

        return;
    }

    const roomRef =
        ref(database, "rooms/" + roomId);

    const snapshot =
        await get(roomRef);

    if(snapshot.exists()){

        localStorage.setItem(
            "currentRoom",
            roomId
        );

        window.location.href =
            "videoroom.html?room=" + roomId;
    }

    else{

        alert("Room does not exist");
    }
};


// =======================================
// CHECK LOGIN
// =======================================

onAuthStateChanged(auth, (user) => {

    console.log("Current User:", user);

});