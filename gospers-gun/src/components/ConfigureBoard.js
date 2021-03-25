import { Component } from 'react';

class ConfigureBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
        rows: 0,
        columns: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleConfigureBoard = this.handleConfigureBoard.bind(this);
  }

  /**
   * Updates component state from input fields
   * @param {*} event Input event object
   */
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    event.preventDefault();
  }

  /**
   * Form submitter. Calls Board component updateCallback() callback with new Field rows/columns
   * @param {*} event Form event object
   */
  handleConfigureBoard(event) {
    const { rows, columns } = this.state;
    let badInput = false;

    if (!parseInt(rows) || !parseInt(columns)) {
        badInput = true;
    } else {
        badInput = false;
    }

    this.props.updateCallback(rows, columns, badInput);
    event.preventDefault();
  }

  render() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-6">
                    <form className="form-inline" onSubmit={this.handleConfigureBoard}>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Enter Number of Rows"  name="rows" onChange={this.handleChange} />
                            <input type="text" className="form-control" placeholder="Enter Number of Columns" name="columns" onChange={this.handleChange} />
                            <button type="submit"  className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
  }
}

export default ConfigureBoard;