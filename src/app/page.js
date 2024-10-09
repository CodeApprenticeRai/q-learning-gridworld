"use client";
import { useEffect, useState } from 'react';
import { arraysEqual, arrayIndexOfMax, objectIsEqual } from "./util";
import dynamic from 'next/dynamic';
import styles from "./page.module.css";
import next from 'next';
import NoSSRWrapper from './NoSSRWrapper';


function App() {
  const alpha = 0.1;
  const epsilon = 0.5;
  const gamma = 0.9;
  const stepReward = -0.4;
  const failReward = -1;
  const successReward = 1;
  const [nRows, setNRows] = useState(3); 
  const [nCols, setNCols] = useState(4);
  const initialState = {x: 0, y: 0};
  const failState = {x: 1, y: 3};
  const successState = {x: 0, y: 3};
  const actions = [
    {id: 0, displayString: "↑", xApply: -1, yApply: 0},
    {id: 1, displayString: "→", xApply: 0, yApply: 1},
    {id: 2, displayString: "↓", xApply: 1, yApply: 0},
    {id: 3, displayString: "←", xApply: 0, yApply: -1}
  ];
  const actionsLength = actions.length;

  const _Q_init = () => {
    let _Q = []; 
    for (let i = 0; i < nRows; i++){
      let row = [];
      for (let j = 0; j < nCols; j++){
        let pos = [i,j];
        let Q_ij = new Array(actionsLength).fill().map((_) => {
          if (!(arraysEqual(pos, [failState.x, failState.y]) || arraysEqual(pos, [successState.x, successState.y]))){
            return 0;
          } else {
            return 0;
          }
        });
        row.push(Q_ij);
      }
      _Q.push(row);
    }
    return _Q;
  }

  const Q_init = _Q_init();

  const [Q, setQ] = useState(Q_init);

  const resetQ = () => {
    setQ(Q_init);
  }

  const [episodeStepNum, setEpisodeStepNum] = useState(0);
  const [numEpisodesCompleted, setNumEpisodesCompleted] = useState(0);

  const resetEpisodeStepNum = () => {
    setEpisodeStepNum(0);
  }

  const stepEpisodeForward = () => {
    if ((objectIsEqual(currentState, successState))||(objectIsEqual(currentState, failState))){ 
      resetEpisode();
    } else {
      stepStateForward();
      setEpisodeStepNum(episodeStepNum + 1);
    }
  }

  const stepEpisodeBackward = () => {
    stepStateBackward();
    setEpisodeStepNum(Math.max(0, episodeStepNum - 1));
  }

  const [QChangeStack, setQChangeStack] = useState([]);

  const resetQChangeStack = () => {
    setQChangeStack([]);
  }

  const resetNumEpisodesCompleted = () => {
    setNumEpisodesCompleted(0);
  }

  const stepNumEpisodesCompleted = () => {
    setNumEpisodesCompleted(numEpisodesCompleted + 1);
  }

  const resetEpisode = () => {
    setCurrentState(initialState);
    resetEpisodeStepNum();
    stepNumEpisodesCompleted();
  }

  const [currentState, setCurrentState] = useState({x: 0, y: 0});
  
  const chooseAction = () => {
    let Q_currentState = Q[currentState.x][currentState.y];
    if (Math.random() < epsilon){
      let _action = Math.floor(Math.random() * Q_currentState.length);
      return actions[_action];
    } else {
      let _action = arrayIndexOfMax(Q_currentState);
      return actions[_action];
    }
  }

  const computeNextState = (action) => {
    let nextState = {
      x: currentState.x + action.xApply,
      y: currentState.y + action.yApply 
    }
    if (
      ((nextState.x < 0) || (nextState.x >= nRows)) ||
      ((nextState.y < 0) || (nextState.y >= nCols))
    ) {
        return currentState;
    }
    return nextState;
  }

  const _setQ = (QNew, currentState, action) => {
    setQ(Q.map((row, i) => {
      if (i == currentState.x){
        return row.map((Q_at_state, j) => {
          if (j == currentState.y){
            return Q_at_state.map((_q, action_i) => {
              if (action_i == action.id){
                return QNew;
              } else {
                return _q;
              }
            });
          } else {
            return Q_at_state;
          }
        });
      } else {
        return row;
      }
    }));
  }

  const reward = (state) => {
    if (objectIsEqual(state, successState)){
      return successReward;
    } else if (objectIsEqual(state, failState)) {
      return failReward;
    } else {
      return stepReward;
    }
  }

  const updateQ = (action, currentState, nextState) => {
    let QCurrent = Q[currentState.x][currentState.y][action.id];
    let nextStateMaxQIndex = arrayIndexOfMax(Q[nextState.x][nextState.y]);
    let nextStateMaxQ = Q[nextState.x][nextState.y][nextStateMaxQIndex];
    let QNew = QCurrent + alpha * (reward(nextState) + (gamma * nextStateMaxQ) - QCurrent);

    _setQ(QNew, currentState, action);
    
    setQChangeStack([
      ...QChangeStack, 
      {
        _previousState: currentState,
        _previousQ: QCurrent
      }
    ]);
  }

  const popQChangeStack = () => {
    let QChangeStackCopy = [...QChangeStack];
    let stateReversionInfo = QChangeStackCopy.pop();
    setQChangeStack(QChangeStackCopy);
    return stateReversionInfo; 
  }

  const stepStateForward = () => {
      let action = chooseAction();
      let nextState = computeNextState(action);
      updateQ(action, currentState, nextState);
      setCurrentState(nextState);
  }

  const stepStateBackward = () => {
    if (QChangeStack.length > 0){
      stateReversionInfo = popQChangeStack();
      setCurrentState(stateReversionInfo._previousState);
      _setQ(stateReversionInfo._previousQ);
    }
  }

  return (
    <div className={styles.appContainer}>
      <h1>Q-Learning Gridworld Example</h1>
      <Table Q={Q} currentState={currentState} />
      <EpisodeStepControls
        stepEpisodeBackward={stepEpisodeBackward} 
        stepEpisodeForward={stepEpisodeForward} 
      />
      <AppStateSummary
        episodeStepNum={episodeStepNum}
        numEpisodesCompleted={numEpisodesCompleted}
        currentState={currentState}
      />
    </div>
  );
}


function Table({
  Q, currentState
}) {
  // let displayRows = [];
  
  // for (let i = 0; i < Q.length; i++){
  //   let displayRow = [];
  //   for (let j = 0; j < Q[i].length; j++){
  //     let displayString = "";
  //     for (let a = 0; a < Q[i][j].length; a++){
  //       displayString += Q[i][j][a];
  //       displayString += "\n";
  //     }
  //     displayRow.push(<td key={j}>{displayString}</td>);
  //   }
  //   displayRows.push(<tr key={i}>{displayRow}</tr>);
  // }

  let displayTable = Q.map((row, i) => 
    (
      <tr key={i}>
        {row.map((col, j) => 
          (
            <td key={j} style={
                ((i===currentState.x) && (j===currentState.y)) ? {border: "4px solid black"} : {}
              }>
              {col.join("\n")}
            </td>
          )
        )}
      </tr>
    )
  );

  return (
    <table className={styles.displayTable}>
      <tbody>
        {displayTable}
      </tbody>
    </table>
  )
}

function EpisodeStepControls({stepEpisodeBackward, stepEpisodeForward}){
  return (
    <div className='episodeStepControlsContainer'>
      <button style={{margin: "1rem"}} onClick={stepEpisodeBackward}>{'<<'}</button>
      <button style={{margin: "1rem"}} onClick={stepEpisodeForward}>{'>>'}</button>
    </div>
  )
}

function AppStateSummary({episodeStepNum, numEpisodesCompleted, currentState}){
  return (
    <div className='appStateSummaryContainer'>
      <p>Steps Taken in Current Episode: {episodeStepNum}</p>
      <p>Episodes Completed: {numEpisodesCompleted}</p>
      <p>Current State: {currentState.x + ", " + currentState.y}</p>
    </div>
  )
}

export default NoSSRWrapper(App);