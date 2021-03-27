  
import React, { Component } from 'react';

class Field extends Component {

	render() {
		const { field, rows } = this.props;

		const flatField = field.flat();

		const fieldRender = flatField.map((item, index) => {
			return <div className={`Cell ${flatField[index] ? 'isActive' : ''}`} />
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