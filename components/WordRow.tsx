type Color = "grey" | "green" | "white" | "yellow";

export const evaluate = (guessWord: string, solutionWord: string): Color[] => {
  const colors = new Array(guessWord.length).fill("grey");

  // Need frequency array to handle letter duplicates in guess/solution word.
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
      colors[i] = "green";
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
      colors[i] = "yellow";
    }
  }

  return colors;
};

const Letter = ({ color, value }: { color: Color; value: string }) => (
  <div
    className={`
      ${
        color === "white"
          ? "bg-white"
          : color === "green"
          ? "bg-green-400"
          : color === "yellow"
          ? "bg-yellow-300"
          : color === "grey"
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
  solutionWord,
  isInput = false,
}: {
  guessWord: string;
  solutionWord: string;
  isInput?: boolean; // Allows for incomplete word.
}) => {
  const colors = !isInput
    ? evaluate(guessWord, solutionWord)
    : new Array(guessWord.length).fill("white");

  return (
    <div className="flex gap-1 justify-start">
      {guessWord.split("").map((letter, i) => (
        <Letter value={letter} color={colors[i]} key={i} />
      ))}
      {/* If incomplete word, fill rest with empty boxes. */}
      {new Array(solutionWord.length - guessWord.length).fill(0).map((_, i) => (
        <Letter key={i} value="" color="white" />
      ))}
    </div>
  );
};
