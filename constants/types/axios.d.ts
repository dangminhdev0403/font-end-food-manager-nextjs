import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    isGuest?: boolean;
  }
}
