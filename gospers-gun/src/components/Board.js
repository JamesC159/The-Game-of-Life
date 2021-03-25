import React, { Component } from 'react';
import { new2DArray, wrapAround } from '../utils/arrayUtils';
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
			corrupt: false
		};

		this.genGospers = this.genGospers.bind(this);
		this.nextGen = this.nextGen.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.init = this.init.bind(this);
		this.updateCallback = this.updateCallback.bind(this);
		this.controlCallback = this.controlCallback.bind(this);
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
		const { field } = this.state;

		//Calculate the midpoint of row/col
		let i = Math.round((field.length - 1) / 2);
		let j = field[0] ? Math.round((field[0].length - 1) / 2) : 1;

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

		//Offset from i, j where we begin and end inserting the static Cell into the field
		let colWidth = Math.round((gun.length - 1) / 2);
		let rowHeight = Math.round((gun[0].length - 1) / 2);
		for (let k = i - colWidth - 1, q = 0; k < i + colWidth; k++, q++) {
			for (let l = j - rowHeight - 1, p = 0; l < j + rowHeight - 1; l++, p++) {
				field[k][l] = gun[q][p];
			}
		}

		this.setState({ field, generation: 0});
	}

	/**
	 * Generates the next generation of the Cells
	 */
	nextGen() {
		const { field, columns, rows, generation } = this.state;
		const nextField = [];

		// Build the new field
		for (var i = 0; i < columns; i++) {
			const newRow = [];

			for (var j = 0; j < rows; j++) {
				//Calculate the wrap around values for toroidal behavior
				const left = wrapAround(j - 1, rows);
				const right = wrapAround(j + 1, rows);
				const up = wrapAround(i - 1, columns);
				const down = wrapAround(i + 1, columns);

				//Count number of alive cells in current cell's region.
				const ctr = 
					Number(field[up][left]) +
					Number(field[up][j]) +
					Number(field[up][right]) +
					Number(field[i][left]) +
					Number(field[i][right]) +
					Number(field[down][left]) +
					Number(field[down][j]) +
					Number(field[down][right]);
				
				//Calculate if current cell is alive or dead
				field[i][j] === 1
				? ctr > 1 && ctr <= 3
					? newRow.push(1)
					: newRow.push(0)
				: ctr === 3
					? newRow.push(1)
					: newRow.push(0);
			}

			nextField.push(newRow);
		}

		this.setState({ field: nextField, generation: generation + 1});
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
		let field = new2DArray(rows, columns);
		this.setState({ field, generation: 0 });
		this.pause();
	}
	
	/**
	 * Child component callback to create a new field
	 * @param {Number} rows The new number of rows in the field
	 * @param {Number} columns The new number of columns in the field
	 */
	updateCallback(rows, columns, badInput) {
		if (badInput) {
			this.setState({ corrupt: true });
		} else {
			let field = new2DArray(rows, columns);
			this.setState({ rows, columns, field, generation: 0, corrupt: false});
		}
		this.pause();
	}

	controlCallback(controlId) {
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
		const { field, columns, rows, generation, corrupt } = this.state;
		
		return (
			<div>
				<Controls controlCallback={this.controlCallback}></Controls>
				<br />
				<ConfigureBoard updateCallback={this.updateCallback} />
				<div className="row">
					{
						corrupt ? <p className="text-center">Invalid input for Rows/Columns, Try again</p> : null
					}
					<Field rows={rows} columns={columns} field={field} />
				</div>
				<h3 className="text-center">Generation: {generation}</h3>
			</div>
		);
	}
}

export default Board;