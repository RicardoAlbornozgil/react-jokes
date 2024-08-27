import React from "react";
import Joke from "./Joke";
import "../styles/JokeList.css";
import useJokes from "../hooks/useJokes";

// List of jokes.

function JokeList({ numJokesToGet = 5 }) {
  const {
    jokes,
    isLoading,
    getJokes,
    vote,
    resetVotes,
    toggleLock
  } = useJokes(numJokesToGet);

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return isLoading ? (
    <div className="loading">
      <i className="fas fa-4x fa-spinner fa-spin" />
    </div>
  ) : (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={getJokes}>
        Get New Jokes
      </button>
      <button className="JokeList-reset" onClick={resetVotes}>
        Reset Votes
      </button>

      {sortedJokes.map(j => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
          locked={j.locked}
          toggleLock={toggleLock}
        />
      ))}
    </div>
  );
}

export default JokeList;
