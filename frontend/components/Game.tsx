import { useState } from "react";
import { CharBox } from "./CharBox";
import { Keyboard } from "./Keyboard";

type Word = {
  value: string;
  type: "empty" | "wrong" | "almost" | "right";
}[];

const WordRow = ({ word }: { word: Word }) => (
  <div className="flex gap-1 justify-center">
    {word.map(({ value, type }) => (
      <CharBox
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
  </div>
);

export const Game = () => {
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [guesses, setGuesses] = useState<Word[]>([
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
  ]);

  return (
    <div>
      <div className="flex flex-col gap-1 mt-1">
        {guesses.map((guess) => (
          <WordRow word={guess} />
        ))}
      </div>
      <Keyboard />
    </div>
  );
};
