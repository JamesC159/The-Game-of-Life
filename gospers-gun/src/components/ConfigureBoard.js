import { Component } from 'react';

class ConfigureBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
        rows: 0,
        columns: 0,
        invalidInput: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleConfigureBoard = this.handleConfigureBoard.bind(this);
  }

  /**
   * Updates component state from input fields
   * @param {*} event Input event object
   */
  handleChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Form submitter. Calls Board component handleUpdate() callback with new Field rows/columns
   * @param {*} event Form event object
   */
  handleConfigureBoard(event) {
    const { rows, columns } = this.state;

    event.preventDefault();
    if (!parseInt(rows) || !parseInt(columns)) {
        this.setState({ invalidInput: true });
    } else {
        this.setState({ invalidInput: false });
        this.props.handleUpdate(rows, columns);
    }
  }

  render() {
    const { invalidInput } = this.state;

    const invalidHTML = (
      <div>
        <br />
        <div class="container-fluid">
          <div className="row justify-content-center">
            <div className="col-6">
              <p className="fw-bold text-danger text-center">Invalid input for Rows/Columns. Must be at least 100x100. Try again</p>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
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
        {
          invalidInput ? invalidHTML : null
        }
      </div>
    );
  }
}

export default ConfigureBoard;
