import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Info, Trash2, Upload } from "lucide-react";

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

interface DocumentListItemProps {
  category: DocumentCategory;
  onDeleteFile: (fileId: string) => void;
  onOpenUploadModal: () => void;
}

const DocumentListItem = ({
  category,
  onDeleteFile,
  onOpenUploadModal,
}: DocumentListItemProps) => {
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

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-background">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`${category.color} p-3 rounded-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0 ms-1">
            <h3 className="text-lg font-semibold truncate">{category.name}</h3>
            <p className="text-sm truncate">{category.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0">
          <Badge variant="secondary">
            {category.files.length} file{category.files.length !== 1 ? "s" : ""}
          </Badge>
          <Button variant="outline" size="sm" onClick={onOpenUploadModal}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {category.files.length > 0 && (
        <div className="mt-4 space-y-2 pl-0 sm:pl-12 max-h-60 overflow-y-auto">
          {category.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs">
                    {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteFile(file.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {category.files.length === 0 && (
        <div className="mt-4 pl-0 sm:pl-12 text-xs text-muted-foreground">
          <span className="flex items-center">
            <Info className="p-1 m-0.5" />
            <p>
              No documents uploaded for this category. Click "Upload" to upload.
            </p>
          </span>
        </div>
      )}
    </div>
  );
};

export default DocumentListItem;
