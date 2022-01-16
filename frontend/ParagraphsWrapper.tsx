import { ReactNode } from "react";

export const ParagraphsWrapper = ({ children }: { children: ReactNode }) => (
  <div className="text-stone-500 flex flex-col gap-3 text-sm">{children}</div>
);
