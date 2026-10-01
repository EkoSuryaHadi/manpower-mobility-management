import type { VerificationStatus, DocumentCategory } from "@/constants";

export interface DocumentSummary {
  id: string;
  documentTypeId: string;
  documentType: { code: string; name: string; category: DocumentCategory };
  documentNumber: string;
  issueDate: string;
  expiryDate: string | null;
  verificationStatus: VerificationStatus;
}

export interface DocumentTypeInfo {
  id: string;
  code: string;
  name: string;
  category: DocumentCategory;
  defaultValidityDays: number | null;
}
