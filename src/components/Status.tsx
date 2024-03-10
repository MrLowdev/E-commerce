import { IconType } from "react-icons";

interface StatusProps {
  text: string;
  icon: IconType;
  bg: string;
  color: string;
}

const Status: React.FC<StatusProps> = ({ bg, color, icon: Icon, text }) => {
  return (
    <div className={`${bg} ${color} ppx-1 rounded flex items-center gap-1`}>
      {text}
      <Icon size={15} />
    </div>
  );
};

export default Status;
