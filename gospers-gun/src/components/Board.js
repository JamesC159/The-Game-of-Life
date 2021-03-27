import React, { Component } from 'react';
import Cell from '../lib/Cell';
import { newField, wrapAround } from '../utils/fieldTools';
import ConfigureBoard from './ConfigureBoard';
import Controls from './Controls';
import Field from './Field';

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rows: 100,
			columns: 100,
			field: [],
			interval: 0,
			generation: 0,
		};

		this.genGospers = this.genGospers.bind(this);
		this.nextGen = this.nextGen.bind(this);
		this.getNeighbors = this.getNeighbors.bind(this);
		this.setNeighbors = this.setNeighbors.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.init = this.init.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleControls = this.handleControls.bind(this);
		this.save = this.save.bind(this);
		this.load = this.load.bind(this);
	}

	/**
	 * Initialize the board on component mount
	 */
	componentDidMount() {
		this.init();
	}

	/**
	 * Generates Gosper's glider gun
	 */
	genGospers() {
		const { field, columns, rows } = this.state;
		const gun = 
			[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
			[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
			[1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

		//Calculate the midpoint of row/col
		const midCols = Math.round((columns - 1) / 2);
		const midRows = Math.round((rows - 1) / 2);

		//Offset to where we begin and end inserting Gosper's Glider Gun into the field
		const midGunRows = Math.round((gun.length - 1) / 2);
		const midGunCols = Math.round((gun[0].length - 1) / 2);

		for (let i = midRows - midGunRows, q = 0; i < midRows + midGunRows + 1; i++, q++) {
			for (let j = midCols - midGunCols, p = 0; j < midCols + midGunCols; j++, p++) {
				field[i][j] = new Cell(gun[q][p]);
			}
		}

		this.setState({ field, generation: 0}, () => {
			// Update the neighbors
			this.setState({ field: this.setNeighbors(field) });
		});
	}

	/**
	 * Generates the next generation of the Cells.
	 */
	nextGen() {
		const { field, columns, rows, generation } = this.state;

		//Performance enhancement over row arrays.
		//First prepare each Cell's nextState
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				let sum = 0;

				//Count alive neighbors
				for (let neighbor of field[i][j].neighbors) {
					if (neighbor.alive && neighbor !== field[i][j]) {
						sum++;
					}
				}

				//Set nextState according to the rules of the game
				field[i][j].alive === 1
				? sum > 1 && sum <= 3
					? field[i][j].nextState = 1
					: field[i][j].nextState = 0
				: sum === 3
					? field[i][j].nextState = 1
					: field[i][j].nextState = 0;
			}
		}

		//Advance and update Cells once next states have been computed
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				field[i][j].update();
			}
		}

		//This is the biggest performance hit for the algorithm.
		//During a 30 second performance analysis, the setState() call took 4814.8 total time. 
		//Clearly React doesn't like big arrays in setState()
		this.setState({ field, generation: generation + 1});
	}

	/**
	 * Gets the neighbors of a Cell in the field.
	 * @param {number} row The row location of the Cell
	 * @param {number} column The column location of the Cell
	 * @returns an array of neighbors of the Cell at row/column
	 */
	getNeighbors(row, column) {
		const { rows, columns, field } = this.state;
		let neighbors = [];

		for (let i = row - 1; i <= row + 1; i++) {
			for (let j = column - 1; j <= column + 1; j++) {
				const wrappedI = wrapAround(i, rows);
				const wrappedJ = wrapAround(j, columns);

				if (i === row && j === column) continue;
				neighbors.push(field[wrappedI][wrappedJ]);
			}
		}

		return neighbors;
	}

	/**
	 * Sets the neighbors for each Cell in the field
	 * @param {[]} field The game field
	 * @returns Updated field with each Cell's neighbors set
	 */
	setNeighbors(field) {
		const { rows, columns } = this.state;

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				field[i][j].neighbors = this.getNeighbors(i, j);
			}
		}

		return field;
	}

	/**
	 * Starts the Game of Life
	 */
	play() {
		clearInterval(this.state.interval);
		const interval = setInterval(this.nextGen, 100);
		this.setState({ interval });
	}

	/**
	 * Pauses the Game of Life
	 */
	pause() {
		clearInterval(this.state.interval);
	}

	/**
	 * Initializes the state of the Board on Reset/componentDidMount
	 */
	init() {
		const { columns, rows } = this.state;

		//Set the field state and then set each Cell's neighbors
		//This was a performance enhancment. Rather than brute forcing row arrays
		//and pushing each row array to the field. We calculate neighbors first and
		//use them to prevent us from having to do this new array allocation and deallocation
		//each time we want to build a new row. The self execution time difference between 
		//doing things this way and the brute force approach is during a 30 second performance
		//analysis of both was 36.3 ms.
		let field = newField(rows, columns);
		this.setState({ field, generation: 0 }, () => {
			this.setState({ field:  this.setNeighbors(field) });
		});
		
		this.pause();
	}
	
	/**
	 * Child component callback to create a new field
	 * @param {Number} rows The new number of rows in the field
	 * @param {Number} columns The new number of columns in the field
	 */
	handleUpdate(rows, columns, badInput) {
		let field = newField(rows, columns);
		this.setState({ rows, columns, field, generation: 0, corrupt: false});
		this.pause();
	}

	/**
	 * Executes actions from the child Controls component button onClick events.
	 * @param {string} controlId Button id attribute passed from the child Controls component.
	 */
	handleControls(controlId) {
		switch (controlId) {
			case "genGospers":
				this.genGospers();
				break;
			case "play":
				this.play();
				break;
			case "pause":
				this.pause();
				break;
			case "reset":
				this.init();
				break;
			case "save":
				this.save();
				break;
			case "load":
				this.load();
				break;
			default:
				console.log(
					`Error: Board component failed to execute Controls component action 
					associated with " + controlId + ". " + controlId + " is not valid`
				);

		}
	}

	/**
	 * Saves the state of the Board component
	 */
	async save() {
		const { field, rows, columns, generation } = this.state;

		try {
			const req = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					field: field,
					rows: rows,
					columns: columns,
					generation: generation
				}),
			};
			await fetch('http://localhost:9000/save', req);
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * Fetches the stored state of the Board component and sets it's state.
	 */
	async load() {
		try {
			const req = {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			};
			const res = await fetch('http://localhost:9000/load', req);
			const jsonRes = await res.json();
			const newState = JSON.parse(jsonRes);
			const field = newState.field;
			const rows = newState.rows;
			const columns = newState.rows;
			const generation = newState.generation;
			this.setState({ rows, columns, field, generation });
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		const { field, columns, rows, generation } = this.state;
		
		return (
			<div>
				<Controls handleControls={this.handleControls}></Controls>
				<br />
				<ConfigureBoard handleUpdate={this.handleUpdate} />
				<br />
				<Field rows={rows} columns={columns} field={field} />
				<h3 className="h3 text-center">Generation: {generation}</h3>
			</div>
		);
	}
}

export default Board;