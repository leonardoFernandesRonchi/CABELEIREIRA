import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  error?: string;
  placeholder?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, placeholder, ...rest }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1.5 pt-2">
          {label}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            placeholder={placeholder}
            className={`w-full h-12 rounded-lg border bg-[#F8FAFC] border-gray-300
            ${icon ? "pl-10" : "px-4"}
            pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
            {...rest}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
