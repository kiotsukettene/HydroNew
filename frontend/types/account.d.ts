type Account = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  owned_devices_count: number;
  address: string;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
};

type UpdateAccountData = {
  first_name?: string;
  last_name?: string;
  address?: string;
};

type UpdateProfilePictureData = {
  profile_image: string;
};

type updatePasswordData = {
  current_password: string;
  new_password: string;
};

type AccountState = {
  account: Account | null;
  loading: boolean;
  error: string | null;
  fetchAccount: () => Promise<void>;
  updateAccount: (data: UpdateAccountData) => Promise<void>;
  updateProfilePicture: (data: UpdateProfilePictureData) => Promise<void>;
  updatePassword: (data: updatePasswordData) => Promise<void>;
};

