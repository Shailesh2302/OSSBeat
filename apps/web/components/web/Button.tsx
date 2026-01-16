import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

import React from "react";

interface OnButtonProps {
  onSubmit: () => void;
  className?: string;
}

const OnButton = ({ onSubmit, className }: OnButtonProps) => {
  return (
    <div className="flex pt-6 flex-wrap justify-center items-center gap-2 md:flex-row">
      <Button
        onClick={onSubmit}
        variant="default"
        className={`bg-background hover:bg-background-800 px-8 text-foreground-100 ${className}`}
      >
        <GithubIcon />
        Get Started
      </Button>
    </div>
  );
};

export default OnButton;
