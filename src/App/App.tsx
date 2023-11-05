import React from 'react';

import Grid from '../Grid/Grid';
import AppControls from '../AppControls/AppControls';

import './App.css';

type AppProps = {

}

type AppState = {
  tableModel : {},
  currState : [number, number]
}

// https://stackoverflow.com/a/16436975/6318046
let arraysEqual = (a : number[], b : number[]) : boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

class App extends React.Component<AppProps, AppState> {
  
  epsilon: number = 0.1;
  failStates: number[][] = [[1,3]];
  goalStates: number[][] = [[0,3]];
  obstacles: number[][] = [[1,1]];
  failReward : number = -1;
  goalReward : number = 1;
  stepReward : number = -0.04;
  discountFactor : number = 0.5;
  learningRate : number = 0.5;
  ACTIONS : number[] = [0, 1, 2, 3]; // 0: up, 1: right, 2: down, 3: left

  numRows : number = 3;
    numCols : number = 4;

  constructor(props : any) {
    super(props);
    

    // let actionToDisplayIconMap = {
    //   0: "↑",
    //   1: "→",
    //   2: "↓",
    //   3: "←"
    // };


    let tableModel : any = {};

    for (let i = 0; i < this.numRows; i++) {
      if (!tableModel.hasOwnProperty(i)) {
        tableModel[i] = {};
      }
      for (let j = 0; j < this.numCols; j++) {
        if (!tableModel[i].hasOwnProperty(j)) {
          tableModel[i][j] = {};
        } 
        for (let action of this.ACTIONS) {
          tableModel[i][j][action] = {"q" : 0};
        }
      }
    }
    
    // goal, obstacle, and fail states are terminal states
    // and thus have no actions defined for their coordinates.
    // let setthis.goalStates = () => {}
    for (let goal of this.goalStates) {
      delete tableModel[goal[0]][goal[1]];
      tableModel[goal[0]][goal[1]] = {"displayString" : "Goal"};
    }
    // let setthis.obstacles = () => {}
    for (let obstacle of this.obstacles) {
      delete tableModel[obstacle[0]][obstacle[1]];
      tableModel[obstacle[0]][obstacle[1]] = {"displayString" : "X"};
    }
    // let setthis.failStates = () => {}
    for (let failState of this.failStates) {
      delete tableModel[failState[0]][failState[1]];
      tableModel[failState[0]][failState[1]] = {"displayString" : "Fail"};
    }

    this.state = {
      tableModel: tableModel,
      currState: [0,0]
    }


  }

  

  render() {
    return (
      <div className="App">
        <div className='App-header'>Q-Learning Grid World Example</div>
        <div>
          <Grid
            numRows={this.numRows}
            numCols={this.numCols}
            table={this.state.tableModel}
          />
        </div>
        <AppControls />
      </div>
    );
  }
}

export default App;
