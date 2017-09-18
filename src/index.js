import React from 'react';
import ReactDOM from 'react-dom';

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

class Board extends React.Component {
    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td className="square" onClick={() => this.props.onClick(0, 0)}>{this.props.squares[0][0]}</td>
                        <td className="square v" onClick={() => this.props.onClick(1, 0)}>{this.props.squares[0][1]}</td>
                        <td className="square" onClick={() => this.props.onClick(2, 0)}>{this.props.squares[0][2]}</td>
                    </tr>
                    <tr>
                        <td className="square h" onClick={() => this.props.onClick(0, 1)}>{this.props.squares[1][0]}</td>
                        <td className="square v h" onClick={() => this.props.onClick(1, 1)}>{this.props.squares[1][1]}</td>
                        <td className="square h" onClick={() => this.props.onClick(2, 1)}>{this.props.squares[1][2]}</td>
                    </tr>
                    <tr>
                        <td className="square" onClick={() => this.props.onClick(0, 2)}>{this.props.squares[2][0]}</td>
                        <td className="square v" onClick={() => this.props.onClick(1, 2)}>{this.props.squares[2][1]}</td>
                        <td className="square" onClick={() => this.props.onClick(2, 2)}>{this.props.squares[2][2]}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.gameInProgess = false;
        this.click = {};
        this.state = {
            gameInProgess: this.gameInProgess,
            history: [],
            stepNumber: 0,
            gameNumber: 0,
            timeRemaining: 0,
            autoRestart: true,
            X: 'bot',
            O: 'human'
        }
        this.startNewGame = this.startNewGame.bind(this);
        this.onInterval = this.onInterval.bind(this);
        this.runInterval = this.runInterval.bind(this);
    }

    componentDidMount() {
        this.timeRemaining = 0;
        this.lastFrame = Date.now();
        this.interval = setInterval(this.onInterval, 5);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    startNewGame() {
        this.click = {};
        this.game = new TicTacToe('X', 'O');
        this.gameState = this.game.getState();
        this.gameInProgess = true;
        this.setState({
            gameInProgess: this.gameInProgess,
            history: [{
                squares: this.gameState.board,
                move: 'Game Start'
            }],
            nextPlayer: this.gameState.currentPlayer,
            winner: this.gameState.winner,
            stepNumber: 0,
            gameNumber: this.state.gameNumber + 1,
            timeRemaining: 0
        });
    }

    onInterval() {
        this.thisFrame = Date.now();
        var elapsed = this.thisFrame - this.lastFrame;
        this.lastFrame = this.thisFrame;

        if (this.timeRemaining > 0) {
            this.timeRemaining -= elapsed;
        }

        var timeRemaining = Math.floor(this.timeRemaining / 1000);

        if (timeRemaining < 0) {
            timeRemaining = 0;
        }

        if (!this.gameInProgess && this.state.gameNumber > 0 && this.state.autoRestart && timeRemaining === 0) {
            this.startNewGame();
        }

        if (this.state.timeRemaining !== timeRemaining) {
            this.setState({ timeRemaining: timeRemaining });
        }

        if (!this.intervalRunning) {
            this.intervalRunning = true;
            setTimeout(this.runInterval, 0);
        }
    }

    runInterval() {
        if (this.gameState && !this.gameState.winner) {
            let moved = false;

            if (this.state[this.gameState.currentPlayer] === 'bot') {
                this.gameState = this.game.autoTurn(this.gameState.currentPlayer);
                moved = true;
            } else {
                if (typeof this.click.x === 'number' && typeof this.click.y === 'number') {
                    if (this.gameState.board[this.click.y][this.click.x] === ' ') {
                        this.gameState = this.game.manualTurn(this.gameState.currentPlayer, this.click.x, this.click.y);
                        moved = true;
                    }

                    this.click = {};
                }
            }

            if (moved) {
                var move;

                if (this.gameState.winner) {
                    this.gameInProgess = false;

                    if (this.state.autoRestart) {
                        this.timeRemaining = 3000;
                    }

                    if (this.gameState.winner === 'X') {
                        move = 'X Wins';
                    } else if (this.gameState.winner === 'O') {
                        move = 'O Wins';
                    } else if (this.gameState.winner === 'none') {
                        move = 'Tie Game';
                    }
                } else {
                    move = this.gameState.lastMove.playerId + ' placed at ' + this.gameState.lastMove.x + ', ' + this.gameState.lastMove.y;
                }

                this.setState({
                    gameInProgess: this.gameInProgess,
                    history: this.state.history.concat([{
                        squares: this.gameState.board,
                        move: move,
                    }]),
                    nextPlayer: this.gameState.currentPlayer,
                    stepNumber: this.state.history.length,
                    winner: this.gameState.winner
                });
            }
        }

        this.intervalRunning = false;
    }

    handleClickBoard(x, y) {
        this.click.x = x;
        this.click.y = y;
    }

    handleClickNewGame() {
        this.startNewGame();
    }

    handleClickToggleAI(playerId) {
        var state = {};

        if (this.state[playerId] === 'bot') {
            state[playerId] = 'human';
        } else {
            state[playerId] = 'bot';
        }

        this.setState(state);
    }

    handleClickToggleAutoRestart() {
        if (this.state.autoRestart) {
            this.timeRemaining = 0;
            this.setState({ autoRestart: false });
        } else {
            this.setState({ autoRestart: true });
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    render() {
        const history = this.state.history;

        let current;

        if (history.length > 0) {
            current = history[this.state.stepNumber];
        } else {
            current = {};
            current.squares = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        }

        let status;

        if (this.state.winner === 'X') {
            status = 'X is the winner';
        } else if (this.state.winner === 'O') {
            status = 'O is the winner';
        } else if (this.state.winner === 'none') {
            status = 'The game is a draw';
        } else {
            if (this.state.nextPlayer) {
                status = 'Next player: ' + this.state.nextPlayer;
            }
        }

        const moves = history.map((step, move) => {
            return (
                <li key={move} className={'list-group-item game-info-item text-center' + (move === this.state.stepNumber ? ' active' : '')} onClick={() => this.jumpTo(move)} style={(move === this.state.stepNumber ? { fontWeight: 'bold' } : {})}>{step.move}</li>
            );
        });

        let gameState;

        if (this.state.gameInProgess) {
            if (this.state.winner) {
                gameState = 'Game Over';
            } else {
                if (this.state[this.state.nextPlayer] === 'human') {
                    gameState = 'Waiting for Player ' + this.state.nextPlayer;
                } else {
                    gameState = 'Game in Progress';
                }
            }
        } else {
            if (this.state.timeRemaining !== 0) {
                gameState = 'Game starting in ' + this.state.timeRemaining + ' seconds';
            } else {
                gameState = 'Waiting to Start';
            }
        }

        return (
            <div className="container full-screen">
                <div className="row mt-4 justify-content-center">
                    <div className="col">
                        <div className="container">
                            <div className="row mt-4 justify-content-center">
                                <div className="text-center">{status}</div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row mt-4 justify-content-center">
                                <Board squares={current.squares} onClick={(x, y) => this.handleClickBoard(x, y)} />
                            </div>
                        </div>
                        <div className="container">
                            <div className="row mt-4 justify-content-center">
                                <p>{gameState}</p>
                            </div>
                            <div className="row mt-4 justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={() => this.handleClickNewGame()}>{this.state.gameInProgess ? 'Restart Game' : 'Start Game'}</button>
                            </div>
                            <div className="row mt-4 justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={() => this.handleClickToggleAutoRestart()}>{this.state.autoRestart ? 'Auto-Restart in On' : 'Auto-Restart in Off'}</button>
                            </div>
                            <div className="row mt-4 justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={() => this.handleClickToggleAI('X')}>{this.state.X === 'bot' ? 'X is Bot' : 'X is Human'}</button>
                            </div>
                            <div className="row mt-4 justify-content-center">
                                <button type="button" className="btn btn-primary" onClick={() => this.handleClickToggleAI('O')}>{this.state.O === 'bot' ? 'O is Bot' : 'O is Human'}</button>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <ul className="list-group">{moves}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            in: true
        };
    }

    render() {
        return (
            <Game />
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));