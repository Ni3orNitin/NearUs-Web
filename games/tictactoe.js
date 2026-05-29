import { database } from "../js/firebase.js";
import { ref, set, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const roomId = params.get("room") || "defaultRoom";

const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turnText");
const restartBtn = document.getElementById("restartBtn");

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
   1. MULTIPLAYER SLOT ALLOCATION (HOST VS GUEST DETECTOR)
   ========================================================================= */
function allocatePlayerRole() {
    const uniqueClientId = Math.random().toString(36).substring(2, 9);
    
    runTransaction(gameRef, (currentData) => {
        if (!currentData) {
            return {
                board: ["", "", "", "", "", "", "", "", ""],
                currentPlayer: "X",
                winner: "",
                playerX: uniqueClientId,
                playerO: ""
            };
        }
        
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
            alert("Match underway. Joining room as spectator.");
        }
    });
}

allocatePlayerRole();

/* =========================================================================
   2. LIVE DATA SYNC
   ========================================================================= */
onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    board = data.board;
    currentPlayer = data.currentPlayer;

    cells.forEach((cell, index) => {
        cell.innerText = board[index];
        // Style moves based on mark
        cell.style.color = (board[index] === "X") ? "#c084fc" : "#10b981";
    });

    if (data.winner === "Draw") {
        turnText.innerText = "It's a Draw! 🤝";
    } else if (data.winner !== "") {
        turnText.innerText = data.winner + " Wins 🔥";
    } else {
        if (assignedSymbol === "SPECTATOR") {
            turnText.innerText = `Spectating Match: Turn ${currentPlayer}`;
        } else {
            turnText.innerText = (assignedSymbol === currentPlayer) ? `Your Turn (${currentPlayer})` : `Waiting for ${currentPlayer}...`;
        }
    }
});

/* =========================================================================
   3. MOVE CELL CLICKS & TURN ENFORCEMENT
   ========================================================================= */
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.dataset.index;

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
   4. MATCH RESET CONTROLLER
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