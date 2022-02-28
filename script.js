const tile_ids = ["&nbsp", "2", "4", "8", "16", "32", "64", "128", "256", "512", "1024", "2048"]; //tile ids
        const tile_colors = ["#f1f1f1", "pink", "red", "orange", "yellow", "green", "cyan", "blue", "indigo", "purple", "violet", "magenta"]; //tile colors
        let n_columns = 4;
        let n_rows = 4;
        const board_default = generate_board(n_columns, n_rows);
        let board = board_default;
        let joined_positions = [];
        let check_move = 0;
        let score = 0;

        function generate_board(array_column_length, array_row_length) {
            let array = [];
            for (i = 0; i < array_row_length; i++) {
                array[i] = new Array(n_columns);
                array[i].fill(0);
            }
            return array;
        }

        function randint(min, max) { //random number generator
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function initialise(new_board) { //initialise new board
            new_board = board_default;
            new_board[randint(0, n_rows - 1)][randint(0, n_columns - 1)] = Math.floor(randint(11, 20) / 10);
            console.log(new_board);
            return new_board;
        }

        function join(board_join, x1, y1, x2, y2) { //Compares two adjacent tiles
            if (board_join[x1][y1] != 0) {
                if (board_join[x2][y2] == 0) {
                    board_join[x2][y2] = board_join[x1][y1];
                    board_join[x1][y1] = 0;
                    check_move = 1;
                }
                else if (board_join[x1][y1] == board_join[x2][y2]) { //Check if both tiles are equal
                    if (!joined_positions.includes(x1 + n_columns * y1) && !joined_positions.includes(x2 + n_columns * y2)) {
                        board_join[x2][y2] += 1;
                        board_join[x1][y1] = 0;
                        joined_positions.push(x2 + n_columns * y2);
                        check_move = 1;
                        score += Math.pow(2, board_join[x2][y2]);
                        document.getElementById("score").innerHTML = "Score: " + score;

                    }
                }
            }
            return board_join;
        }

        function move(board_move, direction) { //Follow a specific set of actions for each individual tile comparison
            joined_positions = [];
            check_move = 0;
            let n_parallel;
            let n_perpendicular;
            switch (direction % 180) {
                case 0: n_parallel = n_rows; n_perpendicular = n_columns; break; //left-right direction
                case 90: n_parallel = n_columns; n_perpendicular = n_rows; break; //up-down direction
            }
            for (let i = 0; i < n_parallel; i++) {
                for (let j = 0; j < n_perpendicular - 1; j++) {
                    for (let k = 1; k < n_perpendicular - j; k++) {
                        switch (direction) {
                            case 0: join(board_move, i, n_perpendicular - 1 - k, i, n_perpendicular - k); break;
                            case 90: join(board_move, k, i, k - 1, i); break;
                            case 180: join(board_move, i, k, i, k - 1); break;
                            case 270: join(board_move, n_perpendicular - 1 - k, i, n_perpendicular - k, i); break;
                        }
                    }
                }
            }
            if (check_move == 1) {
                new_tile(board_move);
                check_move = 0
            }
            display(board_move);
            return board_move;
        }

        function new_tile(board_tile) { //generates new tile on the board after each move
            let empty_tile = [];
            for (let x = 0; x < n_rows; x++) {
                for (let y = 0; y < n_columns; y++) {
                    if (board_tile[x][y] == 0) {
                        empty_tile.push([x, y]);
                    }
                }
            }
            let random_tile = empty_tile[Math.floor(Math.random() * empty_tile.length)];
            board_tile[random_tile[0]][random_tile[1]] = Math.floor(randint(11, 20) / 10);
            return board_tile;
        }

        function display(display_board) { //displays the tiles on the board
            let display_line = "";
            for (let i = 0; i < n_rows; i++) {
                for (let j = 0; j < n_columns; j++) {
                    let display_item = tile_ids[display_board[i][j]];
                    let display_color = tile_colors[display_board[i][j]];
                    display_line += "<div style = 'background-color:" + display_color + ";' class='tile'>" + display_item + "</div>";
                }
            }
            document.getElementById("input").innerHTML = display_line;
        }

        document.getElementById("header").style.width = 95 * n_columns + "px";
        document.getElementById("input").style.width = 95 * n_columns + "px";
        initialise(board);
        display(board);

        document.addEventListener('keyup', (e) => { //Key Listener
            switch (e.code) {
                case "ArrowRight": move(board, 0); break;
                case "ArrowUp": move(board, 90); break;
                case "ArrowLeft": move(board, 180); break;
                case "ArrowDown": move(board, 270); break;
            }
        });