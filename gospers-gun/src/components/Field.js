  
import React, { Component } from 'react';

class Field extends Component {

	render() {
		const { field, columns, rows} = this.props;
		console.log('in field');
		console.log('field rows ' + rows);
		console.log('field columns ' + columns)
		
		const fieldRender = field.map((row, j) => row.map((col, i) => (
				<div
					className={`Cell ${field[j % columns][i % rows] ? 'isActive' : ''}`}
					key={`${i}.${j}`}
				/>
			))
		);

		return (
			<div
				className="Field"
				style={{width: columns * 14}}>
				{fieldRender}
			</div>
		);
	}
}

export default Field