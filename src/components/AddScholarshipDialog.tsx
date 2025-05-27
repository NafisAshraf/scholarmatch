import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Scholarship, Subtask } from "@/types/scholarship";

interface AddScholarshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (scholarship: Omit<Scholarship, "id" | "completed">) => void;
}

export function AddScholarshipDialog({
  open,
  onOpenChange,
  onAdd,
}: AddScholarshipDialogProps) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [subtasks, setSubtasks] = useState<Omit<Subtask, "id">[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  const resetForm = () => {
    setTitle("");
    setDeadline("");
    setSubtasks([]);
    setNewSubtask("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    const scholarship = {
      title: title.trim(),
      deadline,
      subtasks: subtasks.map((subtask, index) => ({
        ...subtask,
        id: Date.now().toString() + index,
      })),
    };

    onAdd(scholarship);
    resetForm();
    onOpenChange(false);
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { title: newSubtask.trim(), completed: false },
    ]);
    setNewSubtask("");
  };

  const removeSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gradient">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Scholarship Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Google Scholarship Program"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Application Steps</Label>

            {/* Add subtask input */}
            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Upload CV, Write SOP (2 pages), Email professor..."
              />
              <Button
                type="button"
                onClick={addSubtask}
                variant="outline"
                size="icon"
                disabled={!newSubtask.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Subtasks list */}
            {subtasks.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <span className="flex-1 text-sm">{subtask.title}</span>
                    <Button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !deadline}
              className="flex-1 bg-button"
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
