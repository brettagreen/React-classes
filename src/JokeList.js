import React from 'react';
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
	constructor() {
		super();
		this.state = {jokes: []};
		this.numJokesToGet = 10;
		this.generateNewJokes = this.generateNewJokes.bind(this);
		this.vote = this.vote.bind(this);
	}

	generateNewJokes() {
		this.setState({jokes: []})
	}

	vote(id, delta) {
		console.log('id', id);
		console.log('delta', delta);
		console.log('jokes', this.state.jokes);
		
		const newJokes = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j));
		this.setState({jokes: newJokes});
	}

	async getJokes() {
		console.log('getJokes',this.state.jokes)

		let j = [...this.state.jokes];
		let seenJokes = new Set();
		try {
			while (j.length < this.numJokesToGet) {
				let res = await axios.get("https://icanhazdadjoke.com", {
					headers: { Accept: "application/json" }
				});
				let { status, ...jokeObj } = res.data;
		
				if (!seenJokes.has(jokeObj.id)) {
					seenJokes.add(jokeObj.id);
					j.push({ ...jokeObj, votes: 0 });
				} else {
					console.error("duplicate found!");
				}
			}
			this.setState({jokes: j});
		} catch (e) {
			console.log(e);
		}
	}

	componentDidMount() {
		console.log('mountJokes',this.state.jokes)
		if (this.state.jokes.length === 0) {
			this.getJokes();
		}
	}

	componentDidUpdate() {
		console.log('updateJokes',this.state.jokes)

		if (this.state.jokes.length === 0) {
			this.getJokes();
		}
	}

	render() {
		console.log('renderJokes',this.state.jokes)
		if (this.state.jokes.length) {
			let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
		  
			return (
			  <div className="JokeList">
				<button className="JokeList-getmore" onClick={this.generateNewJokes}>
				  Get New Jokes
				</button>
		  
				{sortedJokes.map(j => (
				  <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
				))}
			  </div>
			);
		}
		
		return null;
	}
}

export default JokeList;
