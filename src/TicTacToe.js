class TicTacToe {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.winner = undefined;
        this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ];
    }

    getState() {
        var state = {
            board: [],
            currentPlayer: this.currentPlayer,
            winner: this.winner,
            lastMove: this.lastMove
        };

        const getValue = function (data) {
            if (typeof data === 'number') {
                return ' ';
            } else {
                return data;
            }
        }

        state.board.push([getValue(this.board[0]), getValue(this.board[1]), getValue(this.board[2])]);
        state.board.push([getValue(this.board[3]), getValue(this.board[4]), getValue(this.board[5])]);
        state.board.push([getValue(this.board[6]), getValue(this.board[7]), getValue(this.board[8])]);

        return state;
    }

    manualTurn(playerId, x, y) {
        return this.executeTurn(playerId, y * 3 + x);
    }

    autoTurn(playerId) {
        var squareId = this.minimax(this.board, playerId, 0).index;
        return this.executeTurn(playerId, squareId);
    }

    executeTurn(playerId, squareId) {
        if (playerId !== this.player1 && playerId !== this.player2) {
            throw new Error('player ' + playerId + 'is not a legal player');
        }

        if (typeof this.board[squareId] !== 'number') {
            throw new Error('square ' + squareId + ' is not a legal move for player ' + playerId);
        }

        if (!this.currentPlayer) {
            throw new Error('player ' + playerId + ' cannot play after the game has ended');
        }

        if (playerId !== this.currentPlayer) {
            throw new Error('player ' + playerId + ' cannot use player ' + this.currentPlayer + '\'s turn');
        }

        this.board[squareId] = playerId;

        this.lastMove = {
            playerId: playerId,
            x: squareId % 3,
            y: Math.floor(squareId / 3)
        };

        if (this.checkWin(this.board, playerId)) {
            this.currentPlayer = 'none';
            this.winner = playerId;
        } else if (this.checkTie(this.board)) {
            this.currentPlayer = 'none';
            this.winner = 'none';
        } else {
            if (this.currentPlayer === this.player1) {
                this.currentPlayer = this.player2;
            } else {
                this.currentPlayer = this.player1;
            }
        }

        return this.getState();
    }

    checkWin(board, player) {
        let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);

        for (let [index, win] of this.winningCombinations.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                return { index: index, player: player };
            }
        }

        return null;
    }

    checkTie(board) {
        if (this.emptySquares(board).length === 0) {
            return true;
        }

        return false;
    }

    emptySquares(board) {
        return board.filter(s => typeof s === 'number');
    }

    minimax(newBoard, player, depth) {
        if (this.checkWin(newBoard, this.player1)) {
            return { score: depth - 10 };
        } else if (this.checkWin(newBoard, this.player2)) {
            return { score: 10 - depth };
        }

        depth++;

        var availSpots = this.emptySquares(newBoard);

        if (availSpots.length === 0) {
            return { score: 0 };
        }

        if (availSpots.length === 9) {
            return { score: 0, index: Math.floor(9 * Math.random()) }
        }

        var moves = [];
        var lowScore;
        var highScore;

        for (var i = 0; i < availSpots.length; i++) {
            var move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            if (player === this.player2) {
                move.score = this.minimax(newBoard, this.player1, depth).score;
            } else {
                move.score = this.minimax(newBoard, this.player2, depth).score;
            }

            newBoard[availSpots[i]] = move.index;

            if (lowScore === undefined) {
                lowScore = move.score;
                highScore = move.score;
            } else {
                if (move.score < lowScore) {
                    lowScore = move.score;
                }

                if (move.score > highScore) {
                    highScore = move.score;
                }
            }

            moves.push(move);
        }

        var bestScore;

        if (player === this.player2) {
            bestScore = highScore;
        } else {
            bestScore = lowScore;
        }

        var bestMoves = moves.filter(move => move.score === bestScore);

        if (bestMoves.length === 1) {
            return bestMoves[0];
        } else {
            return bestMoves[Math.floor(bestMoves.length * Math.random())];
        }
    }
}

export default TicTacToe;
