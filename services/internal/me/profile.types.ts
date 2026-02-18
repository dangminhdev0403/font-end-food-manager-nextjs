export interface ProfileRes {
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
}

export interface UpdatePasswordBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  refreshToken: string;
}

export interface UpdatePasswordRes {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
