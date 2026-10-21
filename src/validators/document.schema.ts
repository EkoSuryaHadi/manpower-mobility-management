import { z } from "zod";

export const uploadWorkerDocumentSchema = z.object({
  documentTypeId: z.string().uuid("Tipe dokumen tidak valid"),
  documentNumber: z.string().min(2, "Nomor dokumen wajib diisi").max(100),
  issueDate: z.string().refine((d) => !isNaN(Date.parse(d)), "Format tanggal terbit tidak valid"),
  expiryDate: z
    .string()
    .refine((d) => !d || !isNaN(Date.parse(d)), "Format tanggal kedaluwarsa tidak valid")
    .optional()
    .nullable(),
  fileName: z.string().optional(),
  fileUrl: z.string().optional(),
  fileSize: z.number().int().optional(),
  mimeType: z.string().optional(),
});

export type UploadWorkerDocumentInput = z.infer<typeof uploadWorkerDocumentSchema>;
