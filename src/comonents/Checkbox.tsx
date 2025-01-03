import { InputHTMLAttributes } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Checkbox({ label, ...rest }: IProps) {
  return (
    <label className="inline-flex items-center">
      <input {...rest} type="checkbox" className="hidden peer" />
      <div className="w-6 h-6 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary relative">
        <svg
          className="w-5 h-5 text-white absolute top-0 left-0 peer-checked:block"
          fill="none"
          stroke="#ffffff"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      {label && <span className="ml-2"> {label}</span>}
    </label>
  );
}
