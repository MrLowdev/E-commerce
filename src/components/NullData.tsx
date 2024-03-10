interface NullDataProps {
  title: string;
}
const NullData: React.FC<NullDataProps> = ({ title }) => {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center text-xl md:text-2xl">
      <div className="font-medium">{title}</div>
    </div>
  );
};

export default NullData;
