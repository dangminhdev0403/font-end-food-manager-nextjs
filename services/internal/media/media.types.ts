export interface Media {
  id: number;
  url: string;
  status: "TEMP" | "ACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  productId: number | null;
}
export interface UploadImageBody {
  file: File;
}