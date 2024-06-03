interface Props {
  className?: string;
  onChange?: (v: string) => void;
  placeholder?: string,
  value?: string,
  onEnter?: () => void;
}

export function Input({ className, onChange, value, onEnter }: Props) {
  return (
    <input type="text"
      className={className}
      placeholder="Enter your token" 
      value={value} 
      onChange={(e) => onChange?.(e.target.value)} 
      onKeyDown={event => {
        if (event.key === 'Enter') {
          onEnter?.();
        }
      }}
    />
  );
}
