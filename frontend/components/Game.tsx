import { useCallback, useEffect, useState } from "react";
import { CharBox } from "./CharBox";
import { Instructions } from "./Instructions";
import { Keyboard } from "./Keyboard";

const testWords = [
  [
    { value: "a", type: "wrong" },
    { value: "a", type: "almost" },
    { value: "a", type: "right" },
    { value: "a", type: "wrong" },
    { value: "a", type: "wrong" },
    { value: "a", type: "wrong" },
  ],
  [
    { value: "a", type: "wrong" },
    { value: "a", type: "almost" },
    { value: "a", type: "right" },
    { value: "a", type: "wrong" },
    { value: "a", type: "wrong" },
    { value: "a", type: "wrong" },
  ],
];

type Word = {
  value: string;
  type: "empty" | "wrong" | "almost" | "right";
}[];

const WordRow = ({ word }: { word: Word }) => (
  <div className="flex gap-1 justify-start">
    {word.map(({ value, type }, i) => (
      <CharBox
        key={i}
        character={value}
        color={
          type === "empty"
            ? "bg-white"
            : type === "wrong"
            ? "bg-stone-200"
            : type === "right"
            ? "bg-green-400"
            : type === "almost"
            ? "bg-yellow-300"
            : ""
        }
      />
    ))}
    {new Array(5 - word.length).fill(0).map((_, i) => (
      <CharBox key={i} character="" color="bg-white" />
    ))}
  </div>
);

export const Game = () => {
  const [guesses, setGuesses] = useState<Word[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Word>([]);

  const addCharacter = useCallback(
    (character: string) => {
      if (currentGuess.length < 5) {
        setCurrentGuess([
          ...currentGuess,
          {
            value: character,
            type: "empty",
          },
        ]);
      }
    },
    [currentGuess]
  );

  const onSubmit = useCallback(() => {
    if (currentGuess.length === 5) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess([]);
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
          <WordRow word={guess} key={i} />
        ))}
        <WordRow word={currentGuess} />
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
