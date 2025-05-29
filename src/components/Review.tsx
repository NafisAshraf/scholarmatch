"use client";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FileText,
  GraduationCap,
  User,
  Globe,
  LayoutGrid,
  List,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

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

function useUserDocuments() {
  const params = useParams();
  const scholarshipId = params.id as string;
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
        .select("scholarships")
        .eq("user_id", user.id)
        .single();
      if (error) throw new Error(error.message);
      const scholarship = data.scholarships.find(
        (s: any) => s.id === scholarshipId
      );
      return scholarship.documents;
    },
  });
}

const Review = () => {
  const [documents, setDocuments] =
    useState<DocumentCategory[]>(initialDocuments);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);

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

  const handleGenerateReview = async () => {
    setIsGeneratingReview(true);
    // TODO: Implement review generation logic
    setTimeout(() => {
      setIsGeneratingReview(false);
      // For now, just simulate the process
      alert("Review generation would happen here!");
    }, 2000);
  };

  const getTotalFiles = () => {
    return documents.reduce(
      (total, category) => total + category.files.length,
      0
    );
  };

  const getCompletedCategories = () => {
    return documents.filter((category) => category.files.length > 0).length;
  };

  if (isUserDocsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Document Review</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review your uploaded documents and generate an AI-powered analysis to
          ensure your application is complete and optimized.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {getTotalFiles()}
            </div>
            <div className="text-sm text-gray-500">Total Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {getCompletedCategories()}
            </div>
            <div className="text-sm text-gray-500">Categories Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {documents.length}
            </div>
            <div className="text-sm text-gray-500">Total Categories</div>
          </div>
        </div>
      </div>

      {/* Document Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((category) => {
          const IconComponent = category.icon;
          const hasFiles = category.files.length > 0;

          return (
            <div
              key={category.id}
              className={`bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow ${
                hasFiles ? "border-green-200" : "border-gray-200"
              }`}
            >
              {/* Category Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${category.color} text-white`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                  </div>
                  {hasFiles ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-amber-500" size={20} />
                  )}
                </div>
              </div>

              {/* Files List */}
              <div className="p-4">
                {category.files.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      {category.files.length} file
                      {category.files.length !== 1 ? "s" : ""} uploaded
                    </div>
                    {category.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <FileText
                          size={16}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye size={14} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Download size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle
                      className="mx-auto text-amber-400 mb-2"
                      size={24}
                    />
                    <div className="text-sm text-gray-500">
                      No files uploaded
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Generation Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white">
              <Sparkles size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Ready for AI Review?
          </h2>

          <p className="text-gray-600">
            Generate a comprehensive analysis of your uploaded documents. Our AI
            will review your materials for completeness, coherence, and provide
            suggestions for improvement.
          </p>

          {getTotalFiles() > 0 ? (
            <button
              onClick={handleGenerateReview}
              disabled={isGeneratingReview}
              className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                isGeneratingReview ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isGeneratingReview ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating Review...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={18} />
                  Generate AI Review
                </div>
              )}
            </button>
          ) : (
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
              <AlertCircle className="mx-auto text-amber-600 mb-2" size={24} />
              <p className="text-amber-700 font-medium">
                Please upload at least one document to generate a review
              </p>
            </div>
          )}

          {getTotalFiles() > 0 && (
            <div className="text-sm text-gray-500 mt-4">
              Review will analyze {getTotalFiles()} files across{" "}
              {getCompletedCategories()} categories
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
