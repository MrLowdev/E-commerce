"use client";

import { IconType } from "react-icons";

interface ButtonProps {
  disabled?: boolean;
  label: string;
  outline?: boolean;
  small?: boolean;
  custom?: boolean;
  icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  custom,
  disabled,
  icon: Icon,
  outline,
  small,
}) => {
  return (
    <button
      onClick={onClick}
      className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-80 w-full transition border-slate-700 flex items-center justify-center gap-2 ${
        outline ? "bg-white" : "bg-slate-700"
      } ${outline ? "text-slate-700" : "text-white"} ${
        small ? "text-sm font-light" : "text-md font-semibold"
      } ${small ? "py01 px-2 border-[1px]" : "py-3 px-4 border-2"}
      
      ${custom ? custom : ""}
      `}
      disabled={disabled}
    >
      {Icon && <Icon size={24} />} {label}
    </button>
  );
};

export default Button;
