import "./Textbox.css";
import type { ChangeEvent, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};
export const Textbox = ({ value, onChange, className = "", ...props }: Props) => {
  return <textarea value={value} onChange={onChange} className={`textbox ${className}`.trim()} {...props} />;
};
