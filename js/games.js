// ======================================
// LOAD GAMES
// ======================================

export function loadGames(activityWindow){

    activityWindow.innerHTML = `

    <div class="gamesUI">

        <h1>
            🎮 Game Zone
        </h1>

        <div class="gamesGrid">

            <!-- TIC TAC TOE -->

            <div class="gameCard">

                <div class="gameImage tic">
                    ❌
                </div>

                <div class="gameContent">

                    <h2>
                        Tic Tac Toe
                    </h2>

                    <p>
                        Play real-time tic tac toe
                        with your friends
                    </p>

                    <button
                    class="playBtn"
                    id="playTicTacToe">

                        Play Now

                    </button>

                </div>

            </div>

        </div>

    </div>

    `;



    // START GAME

    document
    .getElementById("playTicTacToe")
    .addEventListener("click", () => {

        loadTicTacToe(activityWindow);

    });

}





// ======================================
// TIC TAC TOE GAME
// ======================================

function loadTicTacToe(activityWindow){

    activityWindow.innerHTML = `

    <div class="ticTacToeUI">

        <h1>
            ❌ Tic Tac Toe
        </h1>

        <p class="gameTurn">

            Player X Turn

        </p>

        <div class="ticBoard">

            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>

            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>

            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>

        </div>

        <button
        class="restartBtn"
        id="restartGame">

            Restart Game

        </button>

    </div>

    `;



    const cells =
    document.querySelectorAll(".cell");



    const gameTurn =
    document.querySelector(".gameTurn");



    let currentPlayer = "X";



    let gameActive = true;



    const winPatterns = [

        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]

    ];



    // ======================================
    // CELL CLICK
    // ======================================

    cells.forEach(cell => {

        cell.addEventListener("click", () => {

            if(
                cell.innerHTML !== "" ||
                !gameActive
            ){
                return;
            }



            cell.innerHTML =
            currentPlayer;



            cell.classList.add(
                currentPlayer === "X"
                ? "xColor"
                : "oColor"
            );



            checkWinner();



            currentPlayer =
            currentPlayer === "X"
            ? "O"
            : "X";



            gameTurn.innerHTML =
            "Player " +
            currentPlayer +
            " Turn";

        });

    });





    // ======================================
    // CHECK WINNER
    // ======================================

    function checkWinner(){

        for(let pattern of winPatterns){

            const a =
            cells[pattern[0]].innerHTML;

            const b =
            cells[pattern[1]].innerHTML;

            const c =
            cells[pattern[2]].innerHTML;



            if(
                a !== "" &&
                a === b &&
                b === c
            ){

                gameTurn.innerHTML =
                "🎉 Player " +
                a +
                " Wins";

                gameActive = false;

                return;
            }

        }



        // DRAW

        let filled = true;

        cells.forEach(cell => {

            if(cell.innerHTML === ""){

                filled = false;
            }

        });



        if(filled){

            gameTurn.innerHTML =
            "😅 Match Draw";

            gameActive = false;
        }

    }





    // ======================================
    // RESTART GAME
    // ======================================

    document
    .getElementById("restartGame")
    .addEventListener("click", () => {

        cells.forEach(cell => {

            cell.innerHTML = "";

            cell.classList.remove(
                "xColor"
            );

            cell.classList.remove(
                "oColor"
            );

        });



        currentPlayer = "X";

        gameActive = true;



        gameTurn.innerHTML =
        "Player X Turn";

    });

}