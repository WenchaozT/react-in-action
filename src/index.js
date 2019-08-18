import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "antd/dist/antd.min.css";
import { Row, Modal, Col, Input, Button } from 'antd';

function Square(props) {
    var style = {
        color: props.color
    }
    return (
        <button className="square"
            style={style}
            onClick={props.onClick}
        >
            {props.value}
        </button >
    );
}

class Board extends React.Component {

    renderSquare(i) {

        return (
            <Square
                value={this.props.squares[i]}
                color={this.props.colors[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        var list = () => {
            var col = [];
            for (var j = 0; j < 3; j++) {
                var row = [];
                for (var i = 0; i < 3; i++) {
                    row.push(this.renderSquare(3 * j + i))
                }
                col.push(<div className="board-row"> {row}</div>)
            }
            return <div>{col}</div>
        }
        return (
            list()
        )
        // return (
        //     <div>
        //         <div className="board-row">
        //             {this.renderSquare(0)}
        //             {this.renderSquare(1)}
        //             {this.renderSquare(2)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(3)}
        //             {this.renderSquare(4)}
        //             {this.renderSquare(5)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(6)}
        //             {this.renderSquare(7)}
        //             {this.renderSquare(8)}
        //         </div>
        //     </div>
        // );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                colors: Array(9).fill('black'),
                squares: Array(9).fill(null),
                location: [null, null]
            }],
            stepNumber: 0,
            xIsNext: true,
            addProjectOpen: false,
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' at: (' + step.location + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <Button onClick={() => this.jumpTo(move)}>{desc}</Button>
                </li>
            )
        })
        let status;
        if (winner) {
            status = 'Winner is: ' + (this.state.xIsNext ? 'O' : 'X');
            current.colors = Array(9).fill('black');
            for (let x in winner) {
                current.colors[winner[x]] = 'blue'
            }
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        let addProjectOpen = this.state.addProjectOpen;

        return (
            <div>
                <div className="game">
                    <Col offset={5}>
                        <Button type="primary" onClick={() => this.setState({ addProjectOpen: true })}>
                            新增项目</Button></Col>

                    <Col className="game-board" offset={10}>
                        <Board
                            squares={current.squares}
                            colors={current.colors}
                            onClick={(i) => this.handleClick(i)}
                        />
                        <div className="game-info">
                            <div>{status}</div>
                            <ol>{moves}</ol>
                        </div>
                    </Col>

                </div>

                <Modal
                    centered
                    visible={addProjectOpen}
                    title='添加项目'
                    maskClosable={false}
                    okText={'确认添加'}
                    cancelText={'取消'}
                    className='__qa_releaseNote_modal'
                    onCancel={() => this.setState({ addProjectOpen: false })}>
                    <Row gutter={20}>
                        <Col span={5}>test</Col>
                        <Col span={20}>input <Input></Input></Col>
                    </Row>
                </Modal>
            </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const colors = Array(9).fill('black');
        colors[i] = 'blue';
        this.setState({
            history: history.concat([{
                squares: squares,
                colors: colors,
                location: [parseInt(i / 3) + 1, i - 3 * parseInt(i / 3) + 1],
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
