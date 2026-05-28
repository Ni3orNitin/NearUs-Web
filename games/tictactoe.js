const cells =
document.querySelectorAll(".cell");

const turnText =
document.getElementById("turnText");

const restartBtn =
document.getElementById("restartBtn");



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



cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index =
        cell.dataset.index;



        if(board[index] !== "")
        return;



        board[index] =
        currentPlayer;

        cell.innerText =
        currentPlayer;



        if(checkWinner()){

            turnText.innerText =
            currentPlayer + " Wins 🔥";

            return;
        }



        currentPlayer =
        currentPlayer === "X"
        ? "O"
        : "X";



        turnText.innerText =
        "Turn : " + currentPlayer;

    });

});



function checkWinner(){

    for(let combo of winningCombos){

        const [a,b,c] = combo;

        if(

            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]

        ){

            return true;
        }
    }

    return false;
}



/* RESTART */

restartBtn.addEventListener("click", () => {

    board = [

        "", "", "",
        "", "", "",
        "", "", ""

    ];



    currentPlayer = "X";



    turnText.innerText =
    "Turn : X";



    cells.forEach(cell => {

        cell.innerText = "";

    });

});