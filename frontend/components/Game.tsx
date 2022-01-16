import { useCallback, useEffect, useState } from "react";
import { Instructions } from "./Instructions";
import { Keyboard } from "./Keyboard";
import { WordRow } from "./WordRow";

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
