import React from 'react';
import TicTacToe from './TicTacToe';
import Board from './Board';

class App extends React.Component {
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

export default App;
