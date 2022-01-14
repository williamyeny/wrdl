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
        border-stone-700 
        w-[64px] 
        h-[64px] 
        flex
        justify-center
        items-center
        uppercase
      `}
    >
      <span className="text-xl">{character}</span>
    </div>
  );
};
