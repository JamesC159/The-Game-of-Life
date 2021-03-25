import { Component } from "react";

class Header extends Component {
  render() {
    return (
      <div className="container-fluid bg-dark">
        <div className="jumbotron bg-dark text-white">
          <header className="text-center">
            <h1 className="display-4">{`Conway's Game of Life`}</h1>
          </header>
        </div>
      </div>
    );
  }
}

export default Header;