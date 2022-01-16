import { useCallback, useEffect, useState } from "react";
import { allWordsSet, commonWordsArray } from "../dictionary";
import { Instructions } from "./Instructions";
import { Keyboard } from "./Keyboard";
import { evaluate, WordRow } from "./WordRow";

const getRandomCommonWord = () =>
  commonWordsArray[Math.floor(Math.random() * commonWordsArray.length)];

export const Game = () => {
  const [solutionWord, setSolutionWord] = useState(getRandomCommonWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guessedChars, setGuessedChars] = useState<
    { guessed: "right" | "almost" | "wrong"; character: string }[]
  >([]);
  const [gameState, setGameState] = useState<"playing" | "win" | "lose">(
    "playing"
  );

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
      if (allWordsSet.has(currentGuess)) {
        let newGuessedChars = [...guessedChars];
        const evaluatedColors = evaluate(currentGuess, solutionWord);

        // Check win/loss status.
        if (evaluatedColors.every((color) => color === "green")) {
          setGameState("win");
          alert("You win!");
        } else if (guesses.length === 5) {
          setGameState("lose");
          alert("You lose!");
        }

        // Figure out which keyboard colors to update.
        for (let i = 0; i < currentGuess.length; i++) {
          // Figure out if a character of current guess needs to change color.
          const shouldTurnKeyGreen = evaluatedColors[i] === "green";
          const shouldTurnKeyYellow =
            evaluatedColors[i] === "yellow" &&
            // Not previously guessed to be green.
            !guessedChars.some(
              (c) => c.character === currentGuess[i] && c.guessed === "right"
            );
          const shouldTurnKeyGrey =
            evaluatedColors[i] === "grey" &&
            // Not previously guessed.
            !guessedChars.some((c) => c.character === currentGuess[i]);

          if (shouldTurnKeyGreen || shouldTurnKeyYellow) {
            // Remove existing guessed char, if exists.
            newGuessedChars = newGuessedChars.filter(
              (c) => c.character !== currentGuess[i]
            );

            newGuessedChars.push({
              character: currentGuess[i],
              guessed: shouldTurnKeyGreen ? "right" : "almost",
            });
          } else if (shouldTurnKeyGrey) {
            newGuessedChars.push({
              character: currentGuess[i],
              guessed: "wrong",
            });
          }
        }
        // Update key colors.
        setGuessedChars(newGuessedChars);

        // Record and reset current guess.
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess("");
      } else {
        alert("Not a word!");
      }
    }
  }, [currentGuess, guessedChars, guesses, solutionWord]);

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
          <WordRow guessWord={guess} key={i} solutionWord={solutionWord} />
        ))}
        {gameState === "playing" ? (
          <WordRow
            guessWord={currentGuess}
            solutionWord={solutionWord}
            isInput
          />
        ) : (
          <div>
            <button
              className="bg-stone-900 text-white px-3 py-1 rounded"
              onClick={() => {
                setSolutionWord(getRandomCommonWord());
                setGuesses([]);
                setGuessedChars([]);
                setGameState("playing");
              }}
            >
              {gameState === "win" ? "Go" : "Try"} again!
            </button>
          </div>
        )}
      </div>
      {guesses.length === 0 && <Instructions />}
      <Keyboard
        onKey={addCharacter}
        onSubmit={onSubmit}
        onBackspace={onBackspace}
        guessedChars={guessedChars}
      />
    </div>
  );
};
