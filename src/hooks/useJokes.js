import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useLocalStorage from "./useLocalStorage";

function useJokes(numJokesToGet) {
  const [jokes, setJokes] = useLocalStorage("jokes", []);
  const [isLoading, setIsLoading] = useState(true);

  const getJokes = useCallback(async () => {
    try {
      let newJokes = [];
      let seenJokes = new Set(jokes.map(joke => joke.id));

      while (newJokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          newJokes.push({ ...joke, votes: 0, locked: false });
        } else {
          console.log("duplicate found!");
        }
      }

      setJokes([...newJokes, ...jokes.filter(j => j.locked)]);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [jokes, numJokesToGet, setJokes]);

  useEffect(() => {
    if (jokes.length === 0) {
      getJokes();
    } else {
      setIsLoading(false);
    }
  }, [getJokes, jokes.length]);

  const vote = (id, delta) => {
    setJokes(jokes =>
      jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  };

  const resetVotes = () => {
    const resetJokes = jokes.map(j => ({ ...j, votes: 0 }));
    setJokes(resetJokes);
    window.localStorage.removeItem("jokes");
  };

  const toggleLock = (id) => {
    setJokes(jokes =>
      jokes.map(j =>
        j.id === id ? { ...j, locked: !j.locked } : j
      )
    );
  };

  return { jokes, isLoading, getJokes, vote, resetVotes, toggleLock };
}

export default useJokes;
