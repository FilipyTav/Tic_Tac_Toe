// (function () {
// TODO: reset_board doesnt work at all
let tiles = ["", "", "", "", "", "", "", "", ""];

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

    return { /*tiles,*/ tile_buttons, update_board, reset_board };
})();

const Player = function (player) {
    if (player !== "X" && player !== "O") {
        return;
    }

    const tile_buttons = Gameboard.tile_buttons;
    const update_board = Gameboard.update_board;
    const reset_board = Gameboard.reset_board;
    // let tiles = Gameboard.tiles;

    const is_x = player === "x" || false;

    let is_turn = null;

    let winner = false;

    const play_turn = function () {
        this.is_turn = true;

        const select = function (e) {
            let index = e.target.getAttribute("data_id");
            tiles[index] = `${player}`;
            e.target.classList.add("selected");

            is_winner(player) ? (winner = true) : (player = player);

            // tile_buttons.forEach((button) => {
            //     button.removeEventListener("click", x);
            // });

            this.is_turn = false;

            if (winner) {
                setTimeout(() => {
                    winner = false;
                    reset_board();
                    alert(`${player} wins!`);
                }, 100);
            }

            update_board();
        };

        // Random variable because remove event listener doesnt work unless i do it,
        // as it completely breaks if using .bind(), for some reason.
        // Just...why ?
        let x = select.bind(this);

        if (this.is_turn === true) {
            tile_buttons.forEach((button, index) => {
                if (
                    !button.classList.contains("selected") &&
                    tiles[index] === ""
                ) {
                    button.addEventListener("click", x, {
                        // once: true,
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
        player,
        play_turn,
        winner,
        is_turn,
    };
};

const play_game = (function () {
    let turns = 0;

    const player1 = Player("X");
    const player2 = Player("O");

    while (player1.winner === false && player2.winner === false && turns <= 0) {
        if (turns % 2 === 0) {
            player1.play_turn();

            turns++;
        } else {
            player2.play_turn();

            turns++;
        }
    }
})();
// });
