// (function () {
// I could not find any other way of making this work without
// tiles being a global
let tiles = ["", "", "", "", "", "", "", "", ""];
const manage_modal = (function () {
    const overlay = document.querySelector("#overlay");

    const modal = document.querySelector("#modal");

    overlay.addEventListener("click", _close_modal);
    modal.addEventListener("click", _close_modal);

    function open_modal(text) {
        if (modal == null) return;

        modal.textContent = text;
        modal.classList.add("active");
        overlay.classList.add("active");
    }

    function _close_modal() {
        if (modal == null) return;

        modal.classList.remove("active");
        overlay.classList.remove("active");
    }

    return {
        open_modal,
    };
})();

const Gameboard = (function () {
    const tile_buttons = document.querySelectorAll(".board_tile");

    const _render_tiles = function () {
        tile_buttons.forEach((tile, i) => {
            tile.textContent = tiles[i];
            tile.setAttribute("data_id", `${i}`);
        });
    };

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

    return { tile_buttons, update_board, reset_board };
})();

const Player = function (player) {
    if (player !== "X" && player !== "O") {
        return;
    }

    const tile_buttons = Gameboard.tile_buttons;
    const update_board = Gameboard.update_board;
    const reset_board = Gameboard.reset_board;

    let is_turn = null;

    let winner = false;

    const is_winner = function (player) {
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

const play_game = (function () {
    const player1 = "X";
    const player2 = "O";

    let turns_display = document.querySelector("#turns");

    const reset_board = Gameboard.reset_board;
    const tile_buttons = Gameboard.tile_buttons;
    const update_board = Gameboard.update_board;
    let is_winner = Player("X").is_winner;

    let turns = 0;

    const reset_button = document.querySelector("#reset_board");

    const play_turn = function (player) {
        ++turns;
        turns_display.textContent = `Turn ${turns}`;

        const restart = function () {
            reset_board();
            turns = 0;

            tile_buttons.forEach((button) => {
                button.removeEventListener("click", select);
            });

            play_turn(player);
        };

        const select = function (e) {
            tile_buttons.forEach((button) => {
                button.removeEventListener("click", select);
            });

            reset_button.removeEventListener("click", restart);

            let index = e.target.getAttribute("data_id");
            tiles[index] = `${player}`;
            e.target.classList.add("selected");

            update_board();

            if (is_winner(player)) {
                setTimeout(() => {
                    reset_board();

                    manage_modal.open_modal(`${player} wins!`);
                    turns = 0;
                    play_turn(player);
                }, 100);
                return;
            } else if (turns === 9) {
                setTimeout(() => {
                    reset_board();

                    manage_modal.open_modal(`It's a draw!`);
                    turns = 0;
                    play_turn(player);
                }, 100);
                return;
            }

            if (player === player1) {
                player = player2;
                play_turn(player);
            } else {
                player = player1;
                play_turn(player);
            }
        };

        tile_buttons.forEach((button, index) => {
            if (!button.classList.contains("selected") && tiles[index] === "") {
                button.addEventListener("click", select, {
                    once: true,
                });
            }
        });

        reset_button.addEventListener("click", restart, { once: true });
    };

    play_turn(player1);
})();

// });
