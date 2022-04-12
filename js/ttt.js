// (function () {
const Gameboard = (function () {
    let tiles = ["", "", "", "", "", "", "", "", ""];

    const tile_buttons = document.querySelectorAll(".board_tile");

    const _render_tiles = function () {
        tile_buttons.forEach((tile, index) => {
            tile.textContent = tiles[index];
        });
    };

    const _init = function () {
        _render_tiles();
    };

    const update_board = function () {
        _render_tiles();
    };

    _init();

    return { tiles, tile_buttons, update_board };
})();

const Player = function (player) {
    if (player !== "X" && player !== "O") {
        return;
    }

    const tile_buttons = Gameboard.tile_buttons;
    const update_board = Gameboard.update_board;
    let tiles = Gameboard.tiles;

    let is_turn = null;

    const is_x = player === "x" || false;

    const play_turn = function () {
        const select = function (index, e) {
            tiles[index] = `${player}`;
            e.target.classList.add("selected");

            is_winner(player);

            update_board();
        };

        tile_buttons.forEach((button, index) => {
            button.addEventListener("click", select.bind(null, index), {
                once: true,
            });
        });
    };

    const is_winner = function (player) {
        console.log(tiles);
    };

    return {
        is_turn,
        play_turn,
    };
};

const play_game = (function () {
    let turns = 0;

    const player1 = Player("X");
    const player2 = Player("O");

    player1.play_turn();
    // if (turns % 2 === 0) {
    //     player1.play_turn();
    //     turns++;
    // } else {
    //     player2.play_turn();
    //     turns++;
    // }
})();
// });
