import { create } from 'zustand';

type RegistrationData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string; 
};

type UserRegistrationState = {
     formData: RegistrationData;
     setFormData: (field: keyof RegistrationData, value: string) => void;
     resetFormData: () => void;
};

export const useUserRegistrationStore = create<UserRegistrationState>((set) => ({
    formData: {
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    },

    setFormData: (field, value) => 
        set((state) => ({
            formData: {
                ...state.formData,
                [field]: value,
        },
    })),

    resetFormData:() => set({ formData: {
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    }})
}));

