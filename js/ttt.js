// (function () {
const Gameboard = (function () {
    let tiles = ["", "", "", "", "", "", "", "", ""];

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

    return { tiles, tile_buttons, update_board, reset_board };
})();

const Player = function (player) {
    if (player !== "X" && player !== "O") {
        return;
    }

    const tile_buttons = Gameboard.tile_buttons;
    const update_board = Gameboard.update_board;
    const reset_board = Gameboard.reset_board;
    let tiles = Gameboard.tiles;

    const is_x = player === "x" || false;

    let is_turn = null;

    let winner = false;

    const play_turn = function () {
        const select = function (e) {
            let index = e.target.getAttribute("data_id");
            tiles[index] = `${player}`;
            e.target.classList.add("selected");

            is_winner(player) ? (winner = true) : (player = player);

            tile_buttons.forEach((button) => {
                button.removeEventListener("click", select);
            });

            update_board();
        };

        if (is_turn === true) {
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
        }
    };

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
        play_turn,
        winner,
        is_turn,
    };
};

const play_game = (function () {
    let turns = 0;

    const player1 = Player("X");
    const player2 = Player("O");

    while (player1.winner === false && player2.winner === false && turns <= 9) {
        if (turns % 2 === 0) {
            player1.is_turn = true;
            player1.play_turn();
            player1.is_turn = false;

            turns++;
        } else {
            player2.is_turn = true;
            player2.play_turn();
            player2.is_turn = false;

            turns++;
        }
    }
})();
// });
