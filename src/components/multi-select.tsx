import MultipleSelector, { Option } from "@/components/ui/multiselect";

interface MultiSelectProps {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  options: Option[];
  placeholder?: string;
  label?: string;
}

export default function MultiSelect({
  id,
  value,
  onChange,
  required,
  options,
  placeholder = "Select options",
  label,
}: MultiSelectProps) {
  const selectedOptions = value.map((v) => ({ value: v, label: v }));

  return (
    <div className="*:not-first:mt-2">
      <MultipleSelector
        commandProps={label ? { label } : undefined}
        defaultOptions={options}
        placeholder={placeholder}
        emptyIndicator={<p className="text-center text-sm">No results found</p>}
        value={selectedOptions}
        onChange={(options) => onChange(options.map((opt) => opt.value))}
      />
    </div>
  );
}
