import { IconType } from "react-icons"; // or use `lucide-react` types
import { LucideIcon } from "lucide-react"; // if you use lucide

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;   // generic icon component
  color: "green" | "red" | "yellow" | "blue"; 
  onClick?: () => void;
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  color,
  onClick,
}: ActionCardProps) {
  const colorMap: Record<ActionCardProps["color"], string> = {
    green:
      "from-green-500/20 to-emerald-600/20 border-green-500/30 text-green-400",
    red: "from-red-500/20 to-rose-600/20 border-red-500/30 text-red-400",
    yellow:
      "from-yellow-500/20 to-amber-600/20 border-yellow-500/30 text-yellow-400",
    blue: "from-blue-500/20 to-indigo-600/20 border-blue-500/30 text-blue-400",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 p-8 mb-8 
        transition-all duration-200 
        ${onClick ? "cursor-pointer hover:bg-white/10 hover:scale-[1.02]" : ""}`}
    >
      <div className="flex items-center mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br border flex items-center justify-center mr-4 md ${colorMap[color]}`}
        >
          <Icon className={`w-6 h-6 ${colorMap[color].split(" ").pop()}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
