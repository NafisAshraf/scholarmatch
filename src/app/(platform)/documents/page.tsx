"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Upload,
  FileText,
  GraduationCap,
  Award,
  User,
  Globe,
  Calculator,
  CreditCard,
  Heart,
  Moon,
  Sun,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DocumentUpload from "@/components/DocumentUpload";
import DocumentCard from "@/components/DocumentCard";
import DocumentListItem from "@/components/DocumentListItem";
import { createClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  path: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  files: UploadedFile[];
  color: string;
}

const initialDocuments: DocumentCategory[] = [
  {
    id: "transcripts",
    name: "Academic Transcripts",
    icon: GraduationCap,
    description: "Official academic records and grade reports",
    files: [],
    color: "bg-blue-500",
  },
  {
    id: "lors",
    name: "Letters of Recommendation",
    icon: FileText,
    description: "References from teachers, professors, or employers",
    files: [],
    color: "bg-purple-500",
  },
  {
    id: "sop",
    name: "Statement of Purpose",
    icon: FileText,
    description: "Personal statement explaining your goals and motivation",
    files: [],
    color: "bg-orange-500",
  },
  {
    id: "cv",
    name: "CV / Resume",
    icon: User,
    description: "Professional and academic achievements overview",
    files: [],
    color: "bg-cyan-500",
  },
  {
    id: "english",
    name: "English Proficiency",
    icon: Globe,
    description: "TOEFL, IELTS, Duolingo test scores",
    files: [],
    color: "bg-green-500",
  },
  {
    id: "others",
    name: "Others",
    icon: FileText,
    description: "Other documents",
    files: [],
    color: "bg-pink-500",
  },
];

// Helper to map categoryId to JSONB key
type DocumentJsonbKey =
  | "cv"
  | "lor"
  | "sop"
  | "others"
  | "english"
  | "transcript";
const mapCategoryToJsonbKey = (categoryId: string): DocumentJsonbKey => {
  switch (categoryId) {
    case "cv":
      return "cv";
    case "lors":
      return "lor";
    case "sop":
      return "sop";
    case "english":
      return "english";
    case "transcripts":
      return "transcript";
    default:
      return "others";
  }
};

const STORAGE_BUCKET = "user-documents";

function useUserDocuments() {
  return useQuery({
    queryKey: ["user-documents-profile"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("profiles")
        .select("documents")
        .eq("user_id", user.id)
        .single();
      if (error) throw new Error(error.message);
      return data.documents;
    },
  });
}

function useDocumentUploadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      files,
    }: {
      categoryId: string;
      files: File[];
    }) => {
      const supabase = createClient();
      // Get user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");
      // Get current documents JSONB
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("documents")
        .eq("user_id", user.id)
        .single();
      if (profileError) throw new Error(profileError.message);

      // Upload each file
      const uploadedPaths: string[] = [];
      for (const file of files) {
        const uuid = crypto.randomUUID();
        const path = `${uuid}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("user-documents")
          .upload(path, file);
        if (uploadError) throw new Error(uploadError.message);
        uploadedPaths.push(path);
      }
      // Update documents JSONB
      const key = mapCategoryToJsonbKey(categoryId);
      profile.documents[key] = [
        ...(profile.documents[key] || []),
        ...uploadedPaths,
      ];
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ documents: profile.documents })
        .eq("user_id", user.id);
      if (updateError) throw new Error(updateError.message);
      // Optionally, refetch profile/documents queries
      queryClient.invalidateQueries();
      return uploadedPaths;
    },
  });
}

export default function DocumentsPage() {
  const [documents, setDocuments] =
    useState<DocumentCategory[]>(initialDocuments);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [viewMode, setViewMode] = useState<"tile" | "list">("list");
  const uploadMutation = useDocumentUploadMutation();

  // Fetch user documents from DB
  const { data: userDocuments, isLoading: isUserDocsLoading } =
    useUserDocuments();

  // Map DB docs to UI state
  // This will run on mount and whenever userDocuments changes
  useEffect(() => {
    if (userDocuments) {
      setDocuments((prevDocs) =>
        prevDocs.map((category) => {
          const key = mapCategoryToJsonbKey(category.id);
          const files = (userDocuments[key] || []).map((path: string) => ({
            id: path,
            name: path.split("/").pop(),
            size: 0,
            type: "",
            uploadDate: new Date(),
            path,
          }));
          return { ...category, files };
        })
      );
    }
  }, [userDocuments]);

  const handleFileUpload = (categoryId: string, filesToUpload: File[]) => {
    const newFiles: UploadedFile[] = filesToUpload.map((file) => ({
      id: Math.random().toString(36).substr(2, 9), // Simple unique ID
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      path: "", // This will be updated when the file is uploaded
    }));

    setDocuments((prevDocs) =>
      prevDocs.map((category) =>
        category.id === categoryId
          ? { ...category, files: [...category.files, ...newFiles] }
          : category
      )
    );
    // setSelectedCategory(null); // Close modal after upload is handled by the modal itself
  };

  const handleFileDelete = (categoryId: string, fileId: string) => {
    setDocuments((prevDocs) =>
      prevDocs.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              files: category.files.filter((file) => file.id !== fileId),
            }
          : category
      )
    );
  };

  const totalDocuments = documents.reduce(
    (sum, category) => sum + category.files.length,
    0
  );
  const categoriesWithFiles = documents.filter(
    (category) => category.files.length > 0
  ).length;
  const completionPercentage =
    documents.length > 0 ? (categoriesWithFiles / documents.length) * 100 : 0;

  return (
    <div className="min-h-screen py-16 bg-gradient">
      {/* Header */}
      <div className="">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient">Documents</h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">
                Organize and track your application documents
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setViewMode(viewMode === "tile" ? "list" : "tile")
                }
                className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                aria-label="Toggle view mode"
              >
                {viewMode === "tile" ? (
                  <List className="h-5 w-5" />
                ) : (
                  <LayoutGrid className="h-5 w-5" />
                )}
              </Button>
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 dark:bg-slate-700 dark:text-slate-300"
              >
                {totalDocuments} Documents
              </Badge>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-700 dark:to-indigo-800 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Application Progress</h3>
              <span className="text-2xl font-bold">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress
              value={completionPercentage}
              className="h-3 bg-white/70 dark:bg-white/30 [&>div]:bg-white"
            />
            <p className="mt-2 text-blue-100 dark:text-blue-200">
              {categoriesWithFiles} of {documents.length} document categories
              completed
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "tile" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((category) => (
              <DocumentCard
                key={category.id}
                category={category}
                onUpload={(files) => handleFileUpload(category.id, files)}
                onDelete={(fileId) => handleFileDelete(category.id, fileId)}
                onSelect={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {documents.map((category) => (
              <DocumentListItem
                key={category.id}
                category={category}
                onDeleteFile={(fileId) => handleFileDelete(category.id, fileId)}
                onOpenUploadModal={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {selectedCategory && (
          <DocumentUpload
            category={documents.find((cat) => cat.id === selectedCategory)!}
            onClose={() => setSelectedCategory(null)}
            onUpload={async (filesToUpload) => {
              await uploadMutation.mutateAsync({
                categoryId: selectedCategory,
                files: filesToUpload,
              });
              // Optionally update local state/UI here if needed
            }}
            loading={uploadMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
