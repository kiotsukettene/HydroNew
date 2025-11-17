import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";


export const useAccountStore = create<AccountState>((set, get) => ({
    account: null,
    error: null,
    loading: false,

    fetchAccount: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get("/manage-account");
            set({ account: response.data.data, loading: false });
        } catch (error) {
            const { message } = handleAxiosError(error);
            set({ error: message, loading: false });
        }

    },

    updateAccount: async (data: UpdateAccountData) => {
        set({ loading: true, error: null });
        try {
        const { account } = get();

        const payload = {
            first_name: data.first_name ?? account?.first_name ?? "",
            last_name: data.last_name ?? account?.last_name ?? "",
            address: data.address ?? account?.address ?? "",
        };

        const response = await axiosInstance.put("/update-account", payload);

        set({ account: response.data.data, loading: false });
        } catch (error) {
        const { message } = handleAxiosError(error);
        set({ error: message, loading: false });
        }
    },

    updateProfilePicture: async (data: { profile_image: string }) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            
            const uri = data.profile_image.startsWith('file://')
            ? data.profile_image
            : `file://${data.profile_image}`;
            const fileName = uri.split('/').pop() || 'photo.jpg';
            const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

            formData.append('profile_picture', {
            uri,
            name: fileName,
            type: fileType,
            } as any);

            const response = await axiosInstance.post('/update-profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });

            set({ account: response.data.data, loading: false });
        } catch (error) {
            const { message } = handleAxiosError(error);
            set({ error: message, loading: false });
        }
        },

    updatePassword: async (data: updatePasswordData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.put("/manage-account/update-password", data);
            set({ loading: false });
        } catch (error) {
            const { message } = handleAxiosError(error);
            set({ error: message, loading: false });
            throw new Error(message);
        }
    },


}));