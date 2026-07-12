type SnackbarProps = {
  message: string;
  variant?: "error" | "success" | "default";
};

const Snackbar = ({ message, variant = "default" }: SnackbarProps) => {
  const variantClasses = {
    error: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    default: "bg-gray-100 text-gray-700",
  };

  return (
    <div
      className={`p-4 mb-4 text-sm rounded-md ${variantClasses[variant]}`}
      role="alert"
    >
      <span className=" flex justify-center font-medium">{message}</span>
    </div>
  );
};

export default Snackbar;
