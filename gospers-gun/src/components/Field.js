
import React, { Component, createRef } from 'react';

class Field extends Component {
	constructor(props) {
		super(props);

		this.canvasRef = createRef();
	}

	componentDidMount() {
		const canvas = this.canvasRef.current;
		this.canvasCtx = canvas.getContext('2d');
	}

	componentDidUpdate() {
		this.props.drawCells(this.canvasCtx);
	}

	render() {
		const { rows, columns } = this.props;

		return (
			<div className="container-fluid text-center">
				<canvas ref={this.canvasRef} id="myCanvas" width={columns} height={rows} style={{ 'border': '1px solid black', 'width': columns * 5, 'height': rows * 5 }} />
			</div>
		);
	}
}

export default Field
