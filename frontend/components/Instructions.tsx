export const Instructions = () => (
  <div className="text-stone-500 flex flex-col gap-3 text-sm w-[calc(320px+1rem)] mt-8 mx-auto">
    <p>Guess a 5 letter word. Press Enter to submit.</p>
    <p>Green: in the word and in the right spot.</p>
    <p>Yellow: in the word but in the wrong spot.</p>
    <p>Grey: not in the word.</p>
    <hr />
    <p>
      Game mechanics from{" "}
      <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>. All credits
      to its creator,{" "}
      <a href="https://twitter.com/powerlanguish">Josh Wardle</a>.
    </p>
  </div>
);
