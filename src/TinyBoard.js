import React from 'react';

class TinyBoard extends React.Component {
    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td className="tiny-square">{this.props.squares[0][0]}</td>
                        <td className="tiny-square v">{this.props.squares[0][1]}</td>
                        <td className="tiny-square">{this.props.squares[0][2]}</td>
                    </tr>
                    <tr>
                        <td className="tiny-square h">{this.props.squares[1][0]}</td>
                        <td className="tiny-square v h">{this.props.squares[1][1]}</td>
                        <td className="tiny-square h">{this.props.squares[1][2]}</td>
                    </tr>
                    <tr>
                        <td className="tiny-square">{this.props.squares[2][0]}</td>
                        <td className="tiny-square v">{this.props.squares[2][1]}</td>
                        <td className="tiny-square">{this.props.squares[2][2]}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default TinyBoard;
