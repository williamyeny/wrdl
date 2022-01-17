import { createContext, ReactNode, useState } from "react";

export const SolutionWordContext = createContext({
  solutionWord: "",
  setSolutionWord: (_: string) => {},
});

export const SolutionWordProvider = ({ children }: { children: ReactNode }) => {
  const [solutionWord, setSolutionWord] = useState("");

  return (
    <SolutionWordContext.Provider value={{ solutionWord, setSolutionWord }}>
      {children}
    </SolutionWordContext.Provider>
  );
};
