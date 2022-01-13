export const CharBox = ({
  character,
  color,
}: {
  character: string;
  color: string;
}) => {
  return (
    <div
      className={`
        ${color} 
        border 
        border-stone-800 
        w-[64px] 
        h-[64px] 
        flex
        justify-center
        items-center
      `}
    >
      <span className="font-medium text-2xl">{character}</span>
    </div>
  );
};
