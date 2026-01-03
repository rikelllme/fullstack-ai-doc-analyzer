import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

export interface Document {
  id: number;
  file_name: string;
  text_content: string;
}

export interface UploadResponse {
  id: number;
  file_name: string;
  text_content: string;
}

export interface QuestionResponse {
  answer: string;
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadResponse>("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const askQuestion = async (documentId: number, question: string): Promise<QuestionResponse> => {
  const response = await api.post<QuestionResponse>(`/documents/${documentId}/question`, {
    question,
  });

  return response.data;
};

export const getDocuments = async (): Promise<Document[]> => {
  const response = await api.get<Document[]>("/documents/");
  return response.data;
};
