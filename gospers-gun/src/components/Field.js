  
import React, { Component } from 'react';

class Field extends Component {

	render() {
		const { field, columns, rows} = this.props;
		
		const fieldRender = field.map((row, j) => row.map((col, i) => (
				<div
					className={`Cell ${field[j % columns][i % rows] ? 'isActive' : ''}`}
					key={`${i}.${j}`}
				/>
			))
		);

		return (
			<div className="container-fluid">
				<div
					className="Field"
					style={{width: columns * 14}}>
						{fieldRender}
				</div>
			</div>
		);
	}
}

export default Field