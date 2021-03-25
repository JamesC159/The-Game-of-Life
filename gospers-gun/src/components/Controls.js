import { Component } from "react";

class Controls extends Component {

  constructor(props) {
		super(props);

		this.handleControl = this.handleControl.bind(this);
  }

  handleControl(event) {
  	this.props.controlCallback(event.target.id);
  }

  render() {
  return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-6">
						<div className="btn-group" role="group">
							<button id="genGospers" className="btn btn-secondary" onClick={this.handleControl}>Generate Gosper's Glider Gun</button>
							<button id="play" className="btn btn-secondary" onClick={this.handleControl}>Play</button>
							<button id="pause" className="btn btn-secondary" onClick={this.handleControl}>Pause</button>
							<button id="reset" className="btn btn-secondary" onClick={this.handleControl}>Reset</button>
							<button id="save" className="btn btn-success" onClick={this.handleControl}>Save</button>
							<button id="load" className="btn btn-danger" onClick={this.handleControl}>Load</button>
						</div>
				</div>
			</div>
		</div>
  );
  }
}

export default Controls;