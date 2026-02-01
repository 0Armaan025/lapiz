interface Props {
  label: string;
  color?: string;
  hoverColor?: string;
  onClick: () => void;
}

const PaneButton: React.FC<Props> = ({ label, color, hoverColor, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full justify-center flex flex-row text-xl items-center text-center  px-4 py-[6px]  ${color ? color : "bg-black/80"} border-[0.5px] rounded-lg border-zinc-600 hover:cursor-grabbing ${hoverColor ? hoverColor : "hover:bg-black/40"} transition-all `}
    >
      {label}
    </button>
  );
};

export default PaneButton;
