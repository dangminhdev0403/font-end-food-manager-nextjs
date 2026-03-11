import { httpClient } from "@/services/http/httpClient";
import { backendApiEndpoint } from "@/services/internal/base-url.consants";
import { Media } from "@/services/internal/media/media.types";

const mediaClient = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return httpClient.post<Media>("/media/images/upload", formData, {
      baseURL: backendApiEndpoint,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default mediaClient;
