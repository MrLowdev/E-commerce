"use client";

import NullData from "@/components/NullData";
import { useEffect } from "react";

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <NullData title="Uh Oh Something went wrong!" />;
};

export default ErrorState;
