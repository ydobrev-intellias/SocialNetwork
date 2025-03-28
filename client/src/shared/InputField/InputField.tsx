import { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
  labelText: string;
  name: string;
  type: string;
  field: {
    value: string;
    error: string;
  };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}
function InputField({ labelText, name, type, field, onChange, placeholder }: InputFieldProps) {
  return (
    <div>
      <Label htmlFor={name} className="mb-2">
        {labelText}
      </Label>
      <Input
        name={name}
        id={name}
        type={type}
        value={field.value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {field.error && <span className="inline-block text-red-700 mt-1.5">*{field.error}</span>}
    </div>
  );
}

export default InputField;
