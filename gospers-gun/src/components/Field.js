  
import React, { Component } from 'react';

class Field extends Component {

	render() {
		const { field, rows } = this.props;

		//Flatten and map .Cell styled divs to each Cell
		const flatField = field.flat();
		const fieldRender = flatField.map((item, index) => {
			return <div className={`Cell ${flatField[index].alive ? 'isActive' : ''}`} />
		});

		return (
			<div className="container-fluid">
				<div className="Field" style={{ 'grid-template-columns': `repeat(${ rows }, 1fr)` }}>
						{ fieldRender }
				</div>
			</div>
		);
	}
}

export default Field