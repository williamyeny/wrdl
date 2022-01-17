import { useCallback, useEffect, useState } from "react";
import { allWordsSet, commonWordsArray } from "../dictionary";
import { Instructions, Credits } from "./TextContent";
import { Keyboard } from "./Keyboard";
import { evaluate, WordRow } from "./WordRow";

const getRandomCommonWord = () =>
  commonWordsArray[Math.floor(Math.random() * commonWordsArray.length)];

export const Game = () => {
  const [solutionWord, setSolutionWord] = useState(getRandomCommonWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<
    { guessed: "right" | "almost" | "wrong"; value: string }[]
  >([]);
  const [gameState, setGameState] = useState<"playing" | "win" | "lose">(
    "playing"
  );

  const addLetter = useCallback(
    (letter: string) => {
      if (currentGuess.length < 5) {
        setCurrentGuess(currentGuess + letter);
      }
    },
    [currentGuess]
  );

  const onSubmit = useCallback(() => {
    if (currentGuess.length === 5) {
      if (allWordsSet.has(currentGuess)) {
        let newGuessedLetters = [...guessedLetters];
        const evaluatedColors = evaluate(currentGuess, solutionWord);

        // Check win/loss status.
        if (evaluatedColors.every((color) => color === "green")) {
          setGameState("win");
        } else if (guesses.length === 5) {
          setGameState("lose");
        }

        // Figure out which keyboard colors to update.
        for (let i = 0; i < currentGuess.length; i++) {
          // Figure out if a letter of current guess needs to change color.
          const shouldTurnKeyGreen = evaluatedColors[i] === "green";
          const shouldTurnKeyYellow =
            evaluatedColors[i] === "yellow" &&
            // Not previously guessed to be green.
            !guessedLetters.some(
              (letter) =>
                letter.value === currentGuess[i] && letter.guessed === "right"
            );
          const shouldTurnKeyGrey =
            evaluatedColors[i] === "grey" &&
            // Not previously guessed.
            !guessedLetters.some((letter) => letter.value === currentGuess[i]);

          if (shouldTurnKeyGreen || shouldTurnKeyYellow) {
            // Remove existing guessed letter, if exists.
            newGuessedLetters = newGuessedLetters.filter(
              (letter) => letter.value !== currentGuess[i]
            );

            newGuessedLetters.push({
              value: currentGuess[i],
              guessed: shouldTurnKeyGreen ? "right" : "almost",
            });
          } else if (shouldTurnKeyGrey) {
            newGuessedLetters.push({
              value: currentGuess[i],
              guessed: "wrong",
            });
          }
        }
        // Update key colors.
        setGuessedLetters(newGuessedLetters);

        // Record and reset current guess.
        setGuesses([...guesses, currentGuess]);
        setCurrentGuess("");
      } else {
        alert("Not a word!");
      }
    }
  }, [currentGuess, guessedLetters, guesses, solutionWord]);

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
        addLetter(key);
      } else if (key === "Enter") {
        onSubmit();
      } else if (key === "Backspace") {
        onBackspace();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [addLetter, onBackspace, onSubmit]);

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
          <div className="flex mt-2 justify-between">
            <div className="font-medium">
              <p>{gameState === "win" ? "You won! 🎉" : "You lost... 😞"}</p>
              {gameState === "lose" && (
                <p>
                  The word was{" "}
                  <span className="uppercase font-bold text-stone-700">
                    {solutionWord}
                  </span>
                  .
                </p>
              )}
            </div>
            <div>
              <button
                className="bg-stone-900 text-white px-4 py-1 rounded font-medium inline-block"
                onClick={() => {
                  setSolutionWord(getRandomCommonWord());
                  setGuesses([]);
                  setGuessedLetters([]);
                  setGameState("playing");
                }}
              >
                {gameState === "win" ? "Go again!" : "Try again?"}
              </button>
            </div>
          </div>
        )}
      </div>
      {guesses.length === 0 && (
        <div className="flex flex-col gap-2 w-[calc(320px+1rem)] mt-8 mx-auto">
          <Instructions />
          <hr />
          <Credits />
        </div>
      )}
      <Keyboard
        onKey={addLetter}
        onSubmit={onSubmit}
        onBackspace={onBackspace}
        guessedLetters={guessedLetters}
      />
    </div>
  );
};
