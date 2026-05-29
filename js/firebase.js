// FIREBASE IMPORTS

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



// FIREBASE CONFIG

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

// INITIALIZE

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

const database = getDatabase(app);

export {

    auth,
    provider,
    database,

    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,

    ref,
    set,
    get,
    push,
    onValue,
    remove

};
