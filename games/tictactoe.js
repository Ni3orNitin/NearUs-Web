import {
    database
}
from "../js/firebase.js";

import {
    ref,
    set,
    onValue,
    get
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



/* =========================================
   ROOM ID
========================================= */

const params =
new URLSearchParams(window.location.search);

const roomId =
params.get("room") || "defaultRoom";



/* =========================================
   ELEMENTS
========================================= */

const cells =
document.querySelectorAll(".cell");

const turnText =
document.getElementById("turnText");

const restartBtn =
document.getElementById("restartBtn");



/* =========================================
   GAME STATE
========================================= */

let currentPlayer = "X";

let board = [

    "", "", "",
    "", "", "",
    "", "", ""

];



const winningCombos = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]

];



/* =========================================
   FIREBASE GAME REF
========================================= */

const gameRef =
ref(
    database,
    "rooms/" + roomId + "/ticTacToe"
);



/* =========================================
   CREATE GAME IF NOT EXISTS
========================================= */

async function initializeGame(){

    const snapshot =
    await get(gameRef);

    if(!snapshot.exists()){

        await set(gameRef,{

            board:[

                "", "", "",
                "", "", "",
                "", "", ""

            ],

            currentPlayer:"X",

            winner:""

        });

    }

}

initializeGame();



/* =========================================
   SYNC GAME LIVE
========================================= */

onValue(gameRef,(snapshot)=>{

    const data =
    snapshot.val();

    if(!data) return;



    board =
    data.board;

    currentPlayer =
    data.currentPlayer;



    updateBoard();



    if(data.winner !== ""){

        turnText.innerText =
        data.winner + " Wins 🔥";
    }

    else{

        turnText.innerText =
        "Turn : " + currentPlayer;
    }

});



/* =========================================
   CELL CLICK
========================================= */

cells.forEach(cell => {

    cell.addEventListener("click", async () => {

        const index =
        cell.dataset.index;



        if(board[index] !== "")
        return;



        const newBoard =
        [...board];



        newBoard[index] =
        currentPlayer;



        let winner = "";



        if(checkWinner(newBoard)){

            winner =
            currentPlayer;
        }



        const nextPlayer =
        currentPlayer === "X"
        ? "O"
        : "X";



        await set(gameRef,{

            board:newBoard,

            currentPlayer:nextPlayer,

            winner:winner

        });

    });

});



/* =========================================
   UPDATE UI
========================================= */

function updateBoard(){

    cells.forEach((cell,index)=>{

        cell.innerText =
        board[index];

    });

}



/* =========================================
   CHECK WINNER
========================================= */

function checkWinner(boardCheck){

    for(let combo of winningCombos){

        const [a,b,c] =
        combo;



        if(

            boardCheck[a] &&
            boardCheck[a] === boardCheck[b] &&
            boardCheck[a] === boardCheck[c]

        ){

            return true;
        }

    }

    return false;
}



/* =========================================
   RESTART GAME
========================================= */

restartBtn.addEventListener("click", async () => {

    await set(gameRef,{

        board:[

            "", "", "",
            "", "", "",
            "", "", ""

        ],

        currentPlayer:"X",

        winner:""

    });

});