"use client";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="bg-white-900 rounded-lg w-screen h-screen flex items-center justify-center">
      <ClipLoader color="#C0C2C9" size={40} />
    </div>
  );
};

export default Loading;
