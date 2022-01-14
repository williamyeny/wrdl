const LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace"],
  ["z", "x", "c", "v", "b", "n", "m", "submit"],
];

const Key = ({
  keyValue,
  onClick,
}: {
  keyValue: string;
  onClick: () => void;
}) => {
  return (
    <button
      className="border border-stone-700 w-[42px] h-[42px] uppercase text-stone-500 hover:text-black"
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
}: {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}) => {
  return (
    <div>
      <div className="fixed bottom-1 w-[min(100vw,32rem)] flex flex-col gap-1">
        {LAYOUT.map((keys, i) => (
          <div className="flex justify-center gap-1" key={i}>
            {keys.map((key) => (
              <Key
                keyValue={key}
                key={key}
                onClick={() => {
                  if (key === "backspace") {
                    onBackspace();
                  } else if (key === "submit") {
                    onSubmit();
                  } else {
                    onKey(key);
                  }
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute bottom-1 h-[134px]" />
    </div>
  );
};
