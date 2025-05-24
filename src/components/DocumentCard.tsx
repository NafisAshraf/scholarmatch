import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2 } from "lucide-react"; // Removed Download for now as it's not used
import { useState } from "react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  files: UploadedFile[];
  color: string;
}

interface DocumentCardProps {
  category: DocumentCategory;
  onUpload: (files: File[]) => void;
  onDelete: (fileId: string) => void;
  onSelect: () => void; // This is used to open the upload modal
}

const DocumentCard = ({
  category,
  onUpload,
  onDelete,
  onSelect,
}: DocumentCardProps) => {
  const [dragActive, setDragActive] = useState(false);
  const Icon = category.icon;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md dark:bg-slate-800 dark:border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className={`${category.color} p-2 rounded-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-md font-semibold text-gray-900 dark:text-white">
              {category.name}
            </CardTitle>
            <Badge
              variant="secondary"
              className="mt-1 dark:bg-slate-700 dark:text-slate-300"
            >
              {category.files.length} files
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Upload
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
          {category.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area - Show only if no files are present */}
        {category.files.length === 0 && (
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors dark:border-slate-600 ${
              dragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                : "border-gray-300 hover:border-gray-400 dark:hover:border-slate-500"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id={`file-upload-${category.id}`}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor={`file-upload-${category.id}`}
              className="cursor-pointer"
            >
              <Upload className="h-8 w-8 text-gray-400 dark:text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Drop files here or{" "}
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  browse
                </span>
              </p>
            </label>
          </div>
        )}

        {/* File List */}
        {category.files.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {category.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileText className="h-4 w-4 text-gray-500 dark:text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {formatFileSize(file.size)} •{" "}
                      {formatDate(file.uploadDate)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(file.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {category.files.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              No documents uploaded yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
