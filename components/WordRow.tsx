import { useContext } from "react";
import { Accuracy } from "./Game";
import { SolutionWordContext } from "./SolutionWordContext";

export const evaluate = (
  guessWord: string,
  solutionWord: string
): Accuracy[] => {
  // Index = index of corresponding letter.
  const accuracies: Accuracy[] = new Array(guessWord.length).fill("wrong");

  // Need frequency map to handle letter duplicates in guess/solution word.
  // e.g., with solutionWord "ae" and guessWord "ee", the boxes should be "grey, green".
  const freqs: { [key: string]: number } = {};
  for (const letter of solutionWord) {
    if (!(letter in freqs)) {
      freqs[letter] = 0;
    }
    freqs[letter]++;
  }

  // Mark the right letters in right pos.
  for (let i = 0; i < guessWord.length; i++) {
    if (guessWord[i] === solutionWord[i]) {
      freqs[guessWord[i]]--;
      accuracies[i] = "right";
    }
  }

  // Mark the right letters in wrong pos.
  for (let i = 0; i < guessWord.length; i++) {
    if (
      guessWord[i] !== solutionWord[i] && // Not in right pos...
      guessWord[i] in freqs && // But in the word...
      freqs[guessWord[i]] > 0 // And not all occurrences have been marked yellow or green...
    ) {
      freqs[guessWord[i]]--;
      accuracies[i] = "almost";
    }
  }

  return accuracies;
};

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
