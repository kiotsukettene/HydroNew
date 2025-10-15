import { create } from "zustand";

type RegistrationData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UserRegistrationState = {
  formData: RegistrationData;
  isChecked: boolean;
  setFormData: (field: keyof RegistrationData, value: string) => void;
  toggleCheckbox: (value: boolean) => void;
  resetFormData: () => void;
};

export const useUserRegistrationStore = create<UserRegistrationState>((set) => ({
  formData: {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  isChecked: false,

  setFormData: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  toggleCheckbox: (value) => set({ isChecked: value }),

  resetFormData: () =>
    set({
      formData: {
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      isChecked: false,
    }),
}));
