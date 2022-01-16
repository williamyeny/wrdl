import { useCallback, useEffect, useState } from "react";
import { CharBox } from "./CharBox";
import { Instructions } from "./Instructions";
import { Keyboard } from "./Keyboard";

const WordRow = ({
  guessWord,
  solutionWord,
  isInput = false,
}: {
  guessWord: string;
  solutionWord: string;
  isInput?: boolean; // Allows for incomplete word.
}) => {
  let colors: ("grey" | "green" | "white" | "yellow")[];
  if (!isInput) {
    colors = new Array(guessWord.length).fill("grey");

    // Need frequency array to handle char duplicates in guess/solution word.
    // e.g., with solutionWord "ae" and guessWord "ee", the boxes should be "grey, green".
    const freqs: { [key: string]: number } = {};
    for (const char of solutionWord) {
      if (!(char in freqs)) {
        freqs[char] = 0;
      }
      freqs[char]++;
    }

    // Mark the right chars in right pos.
    for (let i = 0; i < guessWord.length; i++) {
      if (guessWord[i] === solutionWord[i]) {
        freqs[guessWord[i]]--;
        colors[i] = "green";
      }
    }

    // Mark the right chars in wrong pos.
    for (let i = 0; i < guessWord.length; i++) {
      if (
        guessWord[i] !== solutionWord[i] &&
        guessWord[i] in freqs &&
        freqs[guessWord[i]] > 0
      ) {
        freqs[guessWord[i]]--;
        colors[i] = "yellow";
      }
    }
  } else {
    colors = new Array(guessWord.length).fill("white");
  }

  return (
    <div className="flex gap-1 justify-start">
      {guessWord.split("").map((char, i) => (
        <CharBox
          key={i}
          character={char}
          color={
            colors[i] === "white"
              ? "bg-white"
              : colors[i] === "green"
              ? "bg-green-400"
              : colors[i] === "yellow"
              ? "bg-yellow-300"
              : colors[i] === "grey"
              ? "bg-stone-200"
              : ""
          }
        />
      ))}
      {/* If incomplete word, fill rest with empty boxes. */}
      {new Array(5 - guessWord.length).fill(0).map((_, i) => (
        <CharBox key={i} character="" color="bg-white" />
      ))}
    </div>
  );
};

export const Game = () => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const addCharacter = useCallback(
    (character: string) => {
      if (currentGuess.length < 5) {
        setCurrentGuess(currentGuess + character);
      }
    },
    [currentGuess]
  );

  const onSubmit = useCallback(() => {
    if (currentGuess.length === 5) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");
    }
  }, [currentGuess, guesses]);

  const onBackspace = useCallback(() => {
    if (currentGuess.length > 0) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  }, [currentGuess]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { key, metaKey, shiftKey, ctrlKey, altKey, isComposing } = event;

      // Ignore key combinations and inputs.
      if (metaKey || shiftKey || ctrlKey || altKey || isComposing) {
        return;
      }

      if (key.length === 1 && key.match(/[a-z]/i)) {
        addCharacter(key);
      } else if (key === "Enter") {
        onSubmit();
      } else if (key === "Backspace") {
        onBackspace();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [addCharacter, onBackspace, onSubmit]);

  return (
    <div>
      <div className="flex flex-col gap-1 mt-1 w-[calc(320px+1rem)] mx-auto">
        {guesses.map((guess, i) => (
          <WordRow guessWord={guess} key={i} solutionWord={"eaeee"} />
        ))}
        <WordRow guessWord={currentGuess} solutionWord={"eaeee"} isInput />
      </div>
      {guesses.length === 0 && <Instructions />}
      <Keyboard
        onKey={addCharacter}
        onSubmit={onSubmit}
        onBackspace={onBackspace}
      />
    </div>
  );
};
