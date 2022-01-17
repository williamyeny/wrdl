import { useCallback, useContext, useEffect, useState } from "react";
import { allWordsSet, commonWordsArray } from "../dictionary";
import { Instructions, Credits } from "./TextContent";
import { Keyboard } from "./Keyboard";
import { evaluate, WordRow } from "./WordRow";
import { useRouter } from "next/router";
import { SolutionWordContext } from "./SolutionWordContext";

export type Accuracy =
  | "right" // Right letter, right position.
  | "wrong" // Wrong letter.
  | "almost" // Right letter, wrong position.
  | "unknown"; // Not evaluated.

const getRandomCommonWord = () =>
  commonWordsArray[Math.floor(Math.random() * commonWordsArray.length)];

export const Game = () => {
  const { solutionWord, setSolutionWord } = useContext(SolutionWordContext);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<
    { accuracy: Accuracy; value: string }[]
  >([]);
  const [gameState, setGameState] = useState<"playing" | "win" | "lose">(
    "playing"
  );

  // Get word from query params, if exists.
  const router = useRouter();
  useEffect(() => {
    // Init solution word.
    if (!solutionWord && router.isReady) {
      const { query } = router;
      if (typeof query.word === "string") {
        setSolutionWord(Buffer.from(query.word, "base64").toString());
        router.replace("/", undefined, { shallow: true });
        return;
      }

      // If word query param not passed in, get random word.
      setSolutionWord(getRandomCommonWord());
    }
  }, [router, setSolutionWord, solutionWord]);

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
        const accuracies = evaluate(currentGuess, solutionWord);

        // Check win/loss status.
        if (accuracies.every((accuracy) => accuracy === "right")) {
          setGameState("win");
        } else if (guesses.length === 5) {
          setGameState("lose");
        }

        // Figure out which keyboard keys need to update their colors.
        for (let i = 0; i < currentGuess.length; i++) {
          const isKeyRight = accuracies[i] === "right";
          const isKeyAlmost =
            accuracies[i] === "almost" &&
            // Not previously guessed to be right.
            !guessedLetters.some(
              (letter) =>
                letter.value === currentGuess[i] && letter.accuracy === "right"
            );
          const isKeyWrong =
            accuracies[i] === "wrong" &&
            // Not previously guessed.
            !guessedLetters.some((letter) => letter.value === currentGuess[i]);

          if (isKeyRight || isKeyAlmost) {
            // Remove existing guessed letter, if exists.
            newGuessedLetters = newGuessedLetters.filter(
              (letter) => letter.value !== currentGuess[i]
            );

            newGuessedLetters.push({
              value: currentGuess[i],
              accuracy: isKeyRight ? "right" : "almost",
            });
          } else if (isKeyWrong) {
            newGuessedLetters.push({
              value: currentGuess[i],
              accuracy: "wrong",
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
          <WordRow guessWord={guess} key={i} />
        ))}
        {gameState === "playing" ? (
          <WordRow guessWord={currentGuess} isInput />
        ) : (
          <div className="flex mt-2 justify-between">
            <div className="font-medium">
              <p>{gameState === "win" ? "You won! 🎉" : "You lost... 😞"}</p>
              {gameState === "lose" && (
                <p>
                  The word was{" "}
                  <span className="uppercase font-bold text-stone-700 text-base">
                    {solutionWord}
                  </span>
                  .
                </p>
              )}
            </div>
            <div>
              <button
                className="bg-stone-700 text-white px-4 py-1 rounded font-medium inline-block hover:bg-stone-500"
                onClick={() => {
                  setSolutionWord(getRandomCommonWord());
                  setGuesses([]);
                  setGuessedLetters([]);
                  setCurrentGuess("");
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
        <div className="flex flex-col gap-3 w-[calc(320px+1rem)] mt-8 mx-auto">
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
