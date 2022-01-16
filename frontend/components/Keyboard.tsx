const LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace"],
  ["", "z", "x", "c", "v", "b", "n", "m", "submit", ""],
];

const Key = ({
  keyValue,
  onClick,
  guessed,
}: {
  keyValue: string;
  onClick: () => void;
  guessed?: "right" | "wrong" | "almost";
}) => {
  return (
    <button
      className={`${
        keyValue !== "" && "border bg-white"
      } border-stone-700 w-[42px] h-[42px] uppercase text-stone-500 hover:text-black ${
        guessed === "right"
          ? "bg-green-400"
          : guessed === "almost"
          ? "bg-yellow-300"
          : guessed === "wrong"
          ? "bg-stone-200"
          : ""
      }`}
      onClick={onClick}
    >
      {keyValue === "backspace" ? "⌫" : keyValue === "submit" ? "→" : keyValue}
    </button>
  );
};

export const Keyboard = ({
  onKey,
  onBackspace,
  onSubmit,
  guessedChars,
}: {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  guessedChars: { guessed: "right" | "wrong" | "almost"; character: string }[];
}) => {
  return (
    <div>
      <div className="fixed bottom-0 w-[min(100vw,32rem)] flex flex-col gap-1 p-1">
        {LAYOUT.map((keys, i) => (
          <div className="flex justify-center gap-1" key={i}>
            {keys.map((key, j) => (
              <Key
                keyValue={key}
                key={j}
                onClick={() => {
                  if (key === "backspace") {
                    onBackspace();
                  } else if (key === "submit") {
                    onSubmit();
                  } else {
                    onKey(key);
                  }
                }}
                guessed={guessedChars.find((c) => c.character === key)?.guessed}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
