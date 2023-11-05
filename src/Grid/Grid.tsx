import React from 'react';
import './Grid.css';

type GridProps = {
    numRows : number,
    numCols : number,
    table : any
} 

let Grid = (props : GridProps) => {
    let rows = [];

    for (let i = 0; i < props.numRows; i++) {
        let row = [];
        for (let j = 0; j < props.numCols; j++) {
            let displayString = "";
            if (props.table[i][j].displayString === undefined) {
                for (let action in props.table[i][j]){
                    displayString += ("\n" +  props.table[i][j][action].q);
                }
            } else {
                displayString = props.table[i][j].displayString;
            }
            row.push(<td>{displayString}</td>);
        }
        rows.push(<tr>{row}</tr>);
    }


    return (
        <div className='grid-wrapper'>
            <table>{rows}</table>
        </div>
    );
}

export default Grid;