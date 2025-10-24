type Account = {
  id: number;
  email: string;
  full_name: string;
  owned_devices_count: number;
  created_at: string;
  updated_at: string;
};

type AccountState = {
  account: Account | null;
  loading: boolean;
  error: string | null;
  fetchAccount: () => Promise<void>;
};
