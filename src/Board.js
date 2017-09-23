import React from 'react';

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

export default Board;
