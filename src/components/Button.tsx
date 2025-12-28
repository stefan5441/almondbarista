import "./Button.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: ReactNode;
  icon?: IconDefinition;
  onFileSelect?: (file: File) => void;
};

export const Button = ({ label, icon, onFileSelect, className = "", ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onFileSelect) {
      inputRef.current?.click();
    }
    props.onClick?.(e);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect?.(file);
    e.target.value = "";
  };

  return (
    <>
      {onFileSelect && <input type="file" ref={inputRef} style={{ display: "none" }} onChange={handleFileChange} />}
      <button className={`btn ${className}`.trim()} {...props} onClick={handleClick}>
        {icon && <FontAwesomeIcon icon={icon} />}
        {label}
      </button>
    </>
  );
};
