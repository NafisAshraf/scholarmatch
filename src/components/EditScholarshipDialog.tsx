import { useState, useEffect } from "react";
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
import { Scholarship, Subtask } from "@/app/(platform)/dashboard/page";

interface EditScholarshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship: Scholarship;
  onUpdate: (updates: Partial<Scholarship>) => void;
}

export function EditScholarshipDialog({
  open,
  onOpenChange,
  scholarship,
  onUpdate,
}: EditScholarshipDialogProps) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(scholarship.title);
      setDeadline(scholarship.deadline);
      setSubtasks([...scholarship.subtasks]);
    }
  }, [open, scholarship]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    onUpdate({
      title: title.trim(),
      deadline,
      subtasks,
    });

    onOpenChange(false);
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const newTask: Subtask = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, newTask]);
    setNewSubtask("");
  };

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((subtask) => subtask.id !== id));
  };

  const updateSubtask = (id: string, title: string) => {
    setSubtasks((prev) =>
      prev.map((subtask) =>
        subtask.id === id ? { ...subtask, title } : subtask
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Edit Scholarship
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Scholarship Name</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Google Scholarship Program"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deadline">Application Deadline</Label>
            <Input
              id="edit-deadline"
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
                placeholder="Add new step..."
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

            {/* Existing subtasks list */}
            {subtasks.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                  >
                    <Input
                      value={subtask.title}
                      onChange={(e) =>
                        updateSubtask(subtask.id, e.target.value)
                      }
                      className="flex-1 text-sm border-none bg-transparent"
                    />
                    <Button
                      type="button"
                      onClick={() => removeSubtask(subtask.id)}
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
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
