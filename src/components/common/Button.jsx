function Button({ children, variant = 'primary', size = 'medium', onClick, type = 'button', disabled = false, className = '' }) {
    const baseClasses = 'rounded font-medium focus:outline-none transition-colors duration-200';
    
    const variantClasses = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
    };
    
    const sizeClasses = {
      small: 'py-1 px-3 text-sm',
      medium: 'py-2 px-4',
      large: 'py-3 px-6 text-lg',
    };
    
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
    
    return (
      <button
        type={type}
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
  
  export default Button;