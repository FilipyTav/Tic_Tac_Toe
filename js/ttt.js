(function () {
    // I could not find any other way of making this work without
    // tiles being a global
    let tiles = ["", "", "", "", "", "", "", "", ""];

    // Controls functionality of the modal that displays
    // when a player wins or the game ends in a draw
    const manage_modal = (function () {
        const overlay = document.querySelector("#overlay");
        const modal = document.querySelector("#modal");

        // Clicking anywhere in the page closes the modal
        overlay.addEventListener("click", _close_modal);
        modal.addEventListener("click", _close_modal);

        // Opens the modal and changes its text
        function open_modal(text) {
            if (modal == null) return;

            modal.textContent = text;
            modal.classList.add("active");
            overlay.classList.add("active");
        }

        // ...Closes the modal
        function _close_modal() {
            if (modal == null) return;

            modal.classList.remove("active");
            overlay.classList.remove("active");
        }

        // Only the open modal should be visible outside the function
        return {
            open_modal,
        };
    })();

    // Controls the gameboard
    // Ideally, the tiles array should be inside here
    const Gameboard = (function () {
        // Each tile in the board
        const tile_buttons = document.querySelectorAll(".board_tile");

        // Renders the tiles based on the tiles array
        const _render_tiles = function () {
            tile_buttons.forEach((tile, i) => {
                tile.textContent = tiles[i];
                tile.setAttribute("data_id", `${i}`);
            });
        };

        // Resets the array and the display of the board
        const reset_board = function () {
            tiles = ["", "", "", "", "", "", "", "", ""];
            tile_buttons.forEach((tile) => {
                tile.classList.remove("selected");
            });

            _render_tiles();
        };

        const _init = function () {
            _render_tiles();
        };

        const update_board = function () {
            _render_tiles();
        };

        _init();

        return {
            tile_buttons,
            update_board,
            reset_board,
        };
    })();

    // (Supposedly) Controls the dynamic of the players
    // It was pretty good before, but i had a really hard time implementing turn switching the way it was. I could get arround the problem, but it ended up messing up this section, so it is basically useless now.
    const Player = function (player) {
        // Garantees there are only 2 types of players
        if (player !== "X" && player !== "O") {
            return;
        }

        // Property and methods inherited from Gameboard
        const tile_buttons = Gameboard.tile_buttons;
        const update_board = Gameboard.update_board;
        const reset_board = Gameboard.reset_board;

        let is_turn = false;

        let winner = false;

        // Checks if the current player wins after playing the turn
        const is_winner = function (player) {
            // Checks for 3 in a row horizontally
            for (let i = 0; i < tiles.length; i++) {
                if (i === 0 || i === 3 || i === 6) {
                    if (
                        tiles[i] === `${player}` &&
                        tiles[i + 1] === `${player}` &&
                        tiles[i + 2] === `${player}`
                    ) {
                        return true;
                    }
                }
            }

            // Checks for 3 in a row vertically
            for (let i = 0; i < tiles.length; i++) {
                if (i <= 2) {
                    if (
                        tiles[i] === `${player}` &&
                        tiles[i + 3] === `${player}` &&
                        tiles[i + 6] === `${player}`
                    )
                        return true;
                }
            }

            // Checks for 3 in a row diagonally
            for (let i = 0; i < tiles.length; i++) {
                if (i === 0) {
                    if (
                        tiles[i] === `${player}` &&
                        tiles[i + 4] === `${player}` &&
                        tiles[i + 8] === `${player}`
                    )
                        return true;
                } else if (i === 2) {
                    if (
                        tiles[i] === `${player}` &&
                        tiles[i + 2] === `${player}` &&
                        tiles[i + 4] === `${player}`
                    )
                        return true;
                }
            }

            // If there are no 3 in a row of the same player, it is not the winner
            return false;
        };

        return {
            player,
            // play_turn,
            winner,
            is_turn,
            is_winner,
        };
    };

    // Controls the flow of the game and the upper displays
    const play_game = (function () {
        // Both players
        const player1 = "X";
        const player2 = "O";

        // Upper diaplsys
        let turns_display = document.querySelector("#turns");
        let whose_turn = document.querySelector("#player");

        // Inherited property and methods
        const tile_buttons = Gameboard.tile_buttons;
        const reset_board = Gameboard.reset_board;
        const update_board = Gameboard.update_board;
        let is_winner = Player("X").is_winner;

        // Turn count
        let turns = 0;

        // Restart game button
        const reset_button = document.querySelector("#reset_board");

        // Plays the turn of the player
        const play_turn = function (player) {
            ++turns;

            turns_display.textContent = `Turn ${turns}`;
            whose_turn.textContent = `Player ${player} turn`;

            // For the restart game button
            const restart = function () {
                reset_board();
                turns = 0;

                // Removes the event listeners in place
                tile_buttons.forEach((button) => {
                    button.removeEventListener("click", select);
                });

                play_turn(player);
            };

            // When a tile is clicked
            const select = function (e) {
                // Remove the event listeners in all the other tiles
                tile_buttons.forEach((button) => {
                    button.removeEventListener("click", select);
                });

                // Removes event listener in the restart button
                reset_button.removeEventListener("click", restart);

                // Updates the tiles array and the gameboard display
                let index = e.target.getAttribute("data_id");
                tiles[index] = `${player}`;
                e.target.classList.add("selected");

                // Render the board with the updates made
                update_board();

                // If the current player is the winner
                if (is_winner(player)) {
                    // Resets the board and displays the winner in the modal
                    // The timeout is here so the board gets updated before being reset
                    setTimeout(() => {
                        reset_board();

                        manage_modal.open_modal(`${player} wins!`);
                        turns = 0;
                        play_turn(player);
                    }, 100);
                    return;
                }
                // Or if the max amount of turns has been reached without a winner
                else if (turns === 9) {
                    // Resets the board and displays that it is a draw
                    setTimeout(() => {
                        reset_board();

                        manage_modal.open_modal(`It's a draw!`);
                        turns = 0;
                        play_turn(player);
                    }, 100);
                    return;
                }

                // Switch the players at the end of the turn
                if (player === player1) {
                    player = player2;
                    play_turn(player);
                } else {
                    player = player1;
                    play_turn(player);
                }
            };

            // The available tiles become clickable
            tile_buttons.forEach((button, index) => {
                if (
                    !button.classList.contains("selected") &&
                    tiles[index] === ""
                ) {
                    button.addEventListener("click", select, {
                        once: true,
                    });
                }
            });

            // Functionality for the restart game button
            reset_button.addEventListener("click", restart, { once: true });
        };

        // Starts with player1
        play_turn(player1);
    })();
})();
