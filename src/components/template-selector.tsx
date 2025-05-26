import { Button } from "@/components/ui/button";

type Props = {
  selected: "A" | "B";
  onSelect: (t: "A" | "B") => void;
};

export default function TemplateSelector({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-4 items-center">
      <label className="font-medium text-cyan-600">Select template:</label>
      <Button
        variant={selected === "A" ? "default" : "outline"}
        onClick={() => onSelect("A")}
      >
        Modern
      </Button>
      <Button
        variant={selected === "B" ? "default" : "outline"}
        onClick={() => onSelect("B")}
      >
        Classic
      </Button>
    </div>
  );
}
