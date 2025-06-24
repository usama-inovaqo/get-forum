interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'white' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}: ButtonProps) {
  const baseStyles = "rounded-full disabled:opacity-50 font-semibold flex items-center gap-2";
  
  const variants = {
    primary: "bg-[#344054] text-white hover:bg-[#1D2939]",
    secondary: "bg-[#F2F4F7] text-[#344054] hover:bg-[#E4E7EC]",
    white: "bg-white text-[#344054] hover:bg-gray-200",
    pink: "bg-[#d8275d] text-white hover:bg-[#d8275d]/90"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
      disabled={disabled}
    >
      {children}
    </button>
  );
}