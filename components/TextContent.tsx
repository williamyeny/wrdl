import { useIsMobile } from "../hooks";

export const Instructions = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <p>
        Guess the secret 5 letter word. {!isMobile && "Press Enter to submit. "}
        But be careful, you only have 6 guesses!
      </p>
      <p>Green: in the word and in the right spot.</p>
      <p>Yellow: in the word but in the wrong spot.</p>
      <p>Grey: not in the word.</p>
    </>
  );
};

export const Credits = () => (
  <>
    <p>
      Game based on <a href="https://www.powerlanguage.co.uk/wordle/">Wordle</a>{" "}
      by <a href="https://twitter.com/powerlanguish">Josh Wardle</a>.
    </p>
    <p>
      Developed by <a href="https://github.com/williamyeny">Will Ye</a>.
    </p>
  </>
);
