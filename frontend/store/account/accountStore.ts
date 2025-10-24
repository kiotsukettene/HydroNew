import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";

export const useAccountStore = create<AccountState>((set, get) => ({
    account: null,
    error: null,
    loading: false,

    // Fetch account details
    fetchAccount: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/manage-account");
            set({ account: response.data.data, loading: false });
        } catch (error) {
            const { message } = handleAxiosError(error);
            set({ error: message, loading: false });
        }

    }

}));