import { useContext } from "react";
import { evaluate } from "../evaluate";
import { Accuracy } from "./Game";
import { SolutionWordContext } from "./SolutionWordContext";

const Letter = ({ accuracy, value }: { accuracy: Accuracy; value: string }) => (
  <div
    className={`
      ${
        accuracy === "unknown"
          ? "bg-white"
          : accuracy === "right"
          ? "bg-green-400"
          : accuracy === "almost"
          ? "bg-yellow-300"
          : accuracy === "wrong"
          ? "bg-stone-200"
          : ""
      } 
      border 
      border-stone-700 
      w-[64px] 
      h-[64px] 
      flex
      justify-center
      items-center
      uppercase
    `}
  >
    <span className="text-xl">{value}</span>
  </div>
);

export const WordRow = ({
  guessWord,
  isInput = false,
}: {
  guessWord: string;
  isInput?: boolean; // Allows for incomplete word.
}) => {
  const { solutionWord } = useContext(SolutionWordContext);
  const accuracies = !isInput
    ? evaluate(guessWord, solutionWord)
    : new Array(guessWord.length).fill("unknown");

  return (
    <div className="flex gap-1 justify-start">
      {guessWord.split("").map((letter, i) => (
        <Letter value={letter} accuracy={accuracies[i]} key={i} />
      ))}
      {/* If incomplete word, fill rest with empty boxes. */}
      {new Array(solutionWord.length - guessWord.length).fill(0).map((_, i) => (
        <Letter key={i} value="" accuracy="unknown" />
      ))}
    </div>
  );
};
