import React from 'react';
import './App.scss';

function App() {

  const [dimenstions, setDimenstions] = React.useState(5);

  const [users, setUsers] = React.useState(['Omer', 'Rotem', 'No Winner']);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const [currUser, setCurrUser] = React.useState(Math.round(Math.random()));
  const [arrayGame, setArrayGame] = React.useState([...Array(dimenstions)].map(() => [...Array(dimenstions)]));
  const [isGameEnd, setIsGameEnd] = React.useState(false);

  const chooseBox = (idxRow, idxCol) => {
    const diceIsNotEmpty = arrayGame[idxRow][idxCol];
    if (diceIsNotEmpty || isEditMode || isGameEnd) return;
    const copy = arrayGame;
    copy[idxRow][idxCol] = currUser ? 'X' : 'O';
    setArrayGame(copy);
    const isWinner = checkRow(idxRow, idxCol, copy)
      || checkColumn(idxRow, idxCol, copy)
      || checkDiagonals(idxRow, idxCol, copy);
    if (isWinner) {
      setIsGameEnd(true);
    } else {
      const isGameEnd = arrayGame.every(row => row.every(cell => cell));
      if (isGameEnd) {
        setCurrUser(2);
        setIsGameEnd(true);
      } else {
        setCurrUser(currUser ? 0 : 1);
      }
    }
  }

  const checkRow = (idxRow, idxCol, arrayToCheck) => {
    return arrayToCheck[idxRow].every(item => item === arrayToCheck[idxRow][idxCol]);
  }

  const checkColumn = (idxRow, idxCol, arrayToCheck) => {
    return arrayToCheck.every(arrRow => arrRow[idxCol] === arrayToCheck[idxRow][idxCol]);
  }

  const checkDiagonals = (idxRow, idxCol, arrayToCheck) => {
    if (idxRow + idxCol !== dimenstions - 1 && idxRow !== idxCol) return false;
    const mainDiagonal = arrayToCheck.every((item, idx) => {
      return arrayToCheck[idx][idx] === arrayToCheck[idxRow][idxCol]
    });
    const secondDiagonal = arrayToCheck.every((item, idx) => {
      return arrayToCheck[idx][dimenstions - 1 - idx] === arrayToCheck[idxRow][idxCol]
    });
    if (mainDiagonal || secondDiagonal) return true;
    else return false;
  }

  const restartGame = () => {
    setCurrUser(currUser ? 0 : 1);
    setIsGameEnd(false);
    setArrayGame([...Array(dimenstions)].map(() => [...Array(dimenstions)]));
  }

  const changeDimenstions = ({ target }) => {
    if (target.value <= 2 || target.value > 10) return;
    const value = Math.round(Number(target.value));
    setDimenstions(value);
    setArrayGame([...Array(value)].map(() => [...Array(value)]));
  }

  const list = arrayGame.map((item, idxRow) => {
    return arrayGame[idxRow].map((item, idxCol) => {
      const dice = arrayGame[idxRow][idxCol];
      return <li className={`grid-item ${!dice ? 'color' + currUser : ''}`} key={`${idxRow}-${idxCol}`}
        style={{
          backgroundColor: dice === 'X' ? '#b4b4f3' : dice === 'O' ? '#b7ef9e' : '',
          cursor: !dice ? 'pointer' : 'context-menu'
        }}
        onClick={() => chooseBox(idxRow, idxCol)}>
        <div>{dice}</div>
      </li>
    })
  })

  const gridGameStyle = {
    height: `${dimenstions * 110}px`, width: `${dimenstions * 110}px`,
    gridTemplateColumns: `repeat(${dimenstions}, 1fr)`, gridTemplateRows: `repeat(${dimenstions}, 1fr)`
  };

  return (
    <div className="App">
      <h1>Welcome to X&O Game!</h1>

      <span>Change Dimenstions </span>
      <input className="dimenstions-input" type="number" value={dimenstions} onChange={changeDimenstions} />
      <button onClick={restartGame}>Play again!</button>

      <div className="users">
        <div className="user-name">
          User1:&nbsp;
          {isEditMode
            ? <input type="text" value={users[0]} onChange={ev => setUsers([ev.target.value, users[1], 'No Winner'])} />
            : <span>{users[0]}<strong> - O</strong></span>
          }
        </div>
        <div className="user-name">
          User2:&nbsp;
          {isEditMode
            ? <input type="text" value={users[1]} onChange={ev => setUsers([users[0], ev.target.value, 'No Winner'])} />
            : <span>{users[1]}<strong> - X</strong></span>
          }
        </div>
        <button onClick={() => setIsEditMode(!isEditMode)}>{isEditMode ? 'Save' : 'Edit Names'}</button>
      </div>

      <div>
        {isGameEnd
          ? <h3>Game End! Winner: {users[currUser]}</h3>
          : <h3>Now playing:&nbsp;
            <span style={{ backgroundColor: currUser ? '#b4b4f3' : '#b7ef9e' }}>
              {users[currUser]}
            </span>
            <strong> - {currUser ? 'X' : 'O'}</strong>
          </h3>
        }
      </div>

      <ul className="grid-game" style={gridGameStyle}>
        {list}
      </ul>

    </div>
  );
}

export default App;
