import { useMutation } from "@tanstack/react-query";
import mediaClient from "@/services/internal/media/media.client";

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: (file: File) => mediaClient.uploadImage(file),
  });
};
