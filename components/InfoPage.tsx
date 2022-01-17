import { useContext, useEffect, useState } from "react";
import { SolutionWordContext } from "./SolutionWordContext";
import { Credits, Instructions } from "./TextContent";

const CheckSvg = () => (
  <svg
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    width="14px"
    height="14px"
    viewBox="0 0 78.369 78.369"
  >
    <path d="M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704   c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704   C78.477,17.894,78.477,18.586,78.049,19.015z" />
  </svg>
);

const CopySvg = () => (
  <svg
    width="14px"
    height="14px"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"
    ></path>
  </svg>
);

const CopyLink = () => {
  const { solutionWord } = useContext(SolutionWordContext);
  const link = `${window.location.href}?word=${encodeURIComponent(
    Buffer.from(solutionWord).toString("base64")
  )}`;

  const [recentlyCopied, setRecentlyCopied] = useState(false);

  // Reset check icon to copy icon after 1s.
  useEffect(() => {
    if (recentlyCopied) {
      const timeout = setTimeout(() => {
        setRecentlyCopied(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [recentlyCopied]);

  return (
    <div className="inline-flex items-center gap-2 text-sm rounded border border-stone-500 px-2 py-1 text-stone-500 max-w-full">
      <div className="whitespace-nowrap overflow-auto">{link}</div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(link);
          setRecentlyCopied(true);
        }}
        className="hover:text-black p-1"
        aria-label="Copy link"
      >
        {!recentlyCopied ? <CopySvg /> : <CheckSvg />}
      </button>
    </div>
  );
};

export const InfoPage = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed w-screen h-screen bg-white top-0 left-0 z-10">
    <div className="max-w-lg mx-auto relative p-8">
      <button
        className="absolute text-stone-700 top-2 p-2 right-2"
        onClick={onClose}
      >
        <svg
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20px"
          height="20px"
        >
          <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z" />
        </svg>
      </button>
      <div className="flex flex-col gap-2 mt-8">
        <h1>Instructions</h1>
        <Instructions />
        <h1 className="mt-4">Share word</h1>
        <p>Send this link to a friend to work on the same word together!</p>
        <div>
          <CopyLink />
        </div>
        <h1 className="mt-4">Credits</h1>
        <Credits />
        <h1 className="mt-4">Source</h1>
        <p>
          <a href="https://github.com/williamyeny/word-guesser">
            Star me on GitHub!
          </a>
        </p>
      </div>
    </div>
  </div>
);
