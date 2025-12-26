import "./Button.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode;
}

export const Button = ({ label, className = "", ...props }: ButtonProps) => {
  return (
    <button className={`btn ${className}`.trim()} {...props}>
      {label}
    </button>
  );
};
