// import {
//     database
// }
// from "../js/firebase.js";

// import {
//     ref,
//     set,
//     onValue,
//     get
// }
// from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



// /* =========================================
//    ROOM ID
// ========================================= */

// const params =
// new URLSearchParams(window.location.search);

// const roomId =
// params.get("room") || "defaultRoom";



// /* =========================================
//    ELEMENTS
// ========================================= */

// const cells =
// document.querySelectorAll(".cell");

// const turnText =
// document.getElementById("turnText");

// const restartBtn =
// document.getElementById("restartBtn");



// /* =========================================
//    GAME STATE
// ========================================= */

// let currentPlayer = "X";

// let board = [

//     "", "", "",
//     "", "", "",
//     "", "", ""

// ];



// const winningCombos = [

//     [0,1,2],
//     [3,4,5],
//     [6,7,8],

//     [0,3,6],
//     [1,4,7],
//     [2,5,8],

//     [0,4,8],
//     [2,4,6]

// ];



// /* =========================================
//    FIREBASE GAME REF
// ========================================= */

// const gameRef =
// ref(
//     database,
//     "rooms/" + roomId + "/ticTacToe"
// );



// /* =========================================
//    CREATE GAME IF NOT EXISTS
// ========================================= */

// async function initializeGame(){

//     const snapshot =
//     await get(gameRef);

//     if(!snapshot.exists()){

//         await set(gameRef,{

//             board:[

//                 "", "", "",
//                 "", "", "",
//                 "", "", ""

//             ],

//             currentPlayer:"X",

//             winner:""

//         });

//     }

// }

// initializeGame();



// /* =========================================
//    SYNC GAME LIVE
// ========================================= */

// onValue(gameRef,(snapshot)=>{

//     const data =
//     snapshot.val();

//     if(!data) return;



//     board =
//     data.board;

//     currentPlayer =
//     data.currentPlayer;



//     updateBoard();



//     if(data.winner !== ""){

//         turnText.innerText =
//         data.winner + " Wins 🔥";
//     }

//     else{

//         turnText.innerText =
//         "Turn : " + currentPlayer;
//     }

// });



// /* =========================================
//    CELL CLICK
// ========================================= */

// cells.forEach(cell => {

//     cell.addEventListener("click", async () => {

//         const index =
//         cell.dataset.index;



//         if(board[index] !== "")
//         return;



//         const newBoard =
//         [...board];



//         newBoard[index] =
//         currentPlayer;



//         let winner = "";



//         if(checkWinner(newBoard)){

//             winner =
//             currentPlayer;
//         }



//         const nextPlayer =
//         currentPlayer === "X"
//         ? "O"
//         : "X";



//         await set(gameRef,{

//             board:newBoard,

//             currentPlayer:nextPlayer,

//             winner:winner

//         });

//     });

// });



// /* =========================================
//    UPDATE UI
// ========================================= */

// function updateBoard(){

//     cells.forEach((cell,index)=>{

//         cell.innerText =
//         board[index];

//     });

// }



// /* =========================================
//    CHECK WINNER
// ========================================= */

// function checkWinner(boardCheck){

//     for(let combo of winningCombos){

//         const [a,b,c] =
//         combo;



//         if(

//             boardCheck[a] &&
//             boardCheck[a] === boardCheck[b] &&
//             boardCheck[a] === boardCheck[c]

//         ){

//             return true;
//         }

//     }

//     return false;
// }



// /* =========================================
//    RESTART GAME
// ========================================= */

// restartBtn.addEventListener("click", async () => {

//     await set(gameRef,{

//         board:[

//             "", "", "",
//             "", "", "",
//             "", "", ""

//         ],

//         currentPlayer:"X",

//         winner:""

//     });

// });



import { database } from "../js/firebase.js";
import { ref, set, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const roomId = params.get("room") || "defaultRoom";

const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turnText");
const restartBtn = document.getElementById("restartBtn");

// Local Identity Assignment States
let assignedSymbol = null; 
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
const winningCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

const gameRef = ref(database, "rooms/" + roomId + "/ticTacToe");

/* =========================================================================
   MULTYPLAYER SLOT ALLOCATION TRANSACTION
   ========================================================================= */
function allocatePlayerRole() {
    const uniqueClientId = Math.random().toString(36).substring(2, 9);
    
    runTransaction(gameRef, (currentData) => {
        if (!currentData) {
            // Root initialized by client zero
            return {
                board: ["", "", "", "", "", "", "", "", ""],
                currentPlayer: "X",
                winner: "",
                playerX: uniqueClientId,
                playerO: ""
            };
        }
        
        // Claim slot arrays based on presence
        if (!currentData.playerX) {
            currentData.playerX = uniqueClientId;
        } else if (!currentData.playerO && currentData.playerX !== uniqueClientId) {
            currentData.playerO = uniqueClientId;
        }
        return currentData;
    }).then((result) => {
        const snapshot = result.snapshot.val();
        if (snapshot.playerX === uniqueClientId) {
            assignedSymbol = "X";
            alert("You are Player X (Goes First)");
        } else if (snapshot.playerO === uniqueClientId) {
            assignedSymbol = "O";
            alert("You are Player O");
        } else {
            assignedSymbol = "SPECTATOR";
            alert("Match is full. Spectating Mode.");
        }
    });
}

allocatePlayerRole();

/* =========================================================================
   LIVE DATABASE SYNC ENGINE
   ========================================================================= */
onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    board = data.board;
    currentPlayer = data.currentPlayer;

    // Redraw Game elements array
    cells.forEach((cell, index) => {
        cell.innerText = board[index];
        cell.classList.remove("taken");
        if(board[index] !== "") cell.classList.add("taken");
    });

    if (data.winner === "Draw") {
        turnText.innerText = "It's a Draw! 🤝";
    } else if (data.winner !== "") {
        turnText.innerText = data.winner + " Wins 🔥";
    } else {
        turnText.innerText = (assignedSymbol === currentPlayer) ? `Your Turn (${currentPlayer})` : `Waiting for ${currentPlayer}...`;
    }
});

/* =========================================================================
   CELL INTERACTION AND VALIDATION
   ========================================================================= */
cells.forEach(cell => {
    cell.addEventListener("click", async () => {
        const index = cell.dataset.index;

        // Break execution path if context is invalid
        if (assignedSymbol === "SPECTATOR") return;
        if (currentPlayer !== assignedSymbol) return;
        if (board[index] !== "") return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;

        let winner = "";
        if (checkWinner(newBoard)) {
            winner = currentPlayer;
        } else if (!newBoard.includes("")) {
            winner = "Draw";
        }

        const nextPlayer = currentPlayer === "X" ? "O" : "X";

        // Keep player role hashes intact during data manipulation
        runTransaction(gameRef, (currentData) => {
            if (currentData) {
                currentData.board = newBoard;
                currentData.currentPlayer = nextPlayer;
                currentData.winner = winner;
            }
            return currentData;
        });
    });
});

function checkWinner(boardCheck) {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (boardCheck[a] && boardCheck[a] === boardCheck[b] && boardCheck[a] === boardCheck[c]) {
            return true;
        }
    }
    return false;
}

/* =========================================================================
   RESET STATE METHOD
   ========================================================================= */
restartBtn.addEventListener("click", () => {
    runTransaction(gameRef, (currentData) => {
        if (currentData) {
            currentData.board = ["", "", "", "", "", "", "", "", ""];
            currentData.currentPlayer = "X";
            currentData.winner = "";
        }
        return currentData;
    });
});