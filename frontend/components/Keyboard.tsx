const LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace"],
  ["z", "x", "c", "v", "b", "n", "m", "submit"],
];

const Key = ({ keyValue }: { keyValue: string }) => {
  const onClick = () => {
    if (keyValue === "submit") {
      //
    } else if (keyValue == "backspace") {
      //
    }
    //
  };

  return (
    <button
      className="border border-stone-800 w-[42px] h-[42px]"
      onClick={onClick}
    >
      {keyValue === "backspace" ? "⌫" : keyValue === "submit" ? "→" : keyValue}
    </button>
  );
};

export const Keyboard = () => {
  return (
    <div>
      <div className="fixed bottom-1 w-[min(100vw,32rem)] flex flex-col gap-1">
        {LAYOUT.map((keys, i) => (
          <div className="flex justify-center gap-1" key={i}>
            {keys.map((key) => (
              <Key keyValue={key} key={key} />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute bottom-1 h-[134px]" />
    </div>
  );
};
