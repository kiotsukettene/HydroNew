import { create } from "zustand";

type FormData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type UserRegistrationState = {
  formData: FormData;
  isChecked: boolean;
  setFormData: (key: keyof FormData, value: string) => void;
  toggleCheckbox: (checked: boolean) => void;
  reset: () => void;
};

export const useUserRegistrationStore = create<UserRegistrationState>((set) => ({
  formData: {
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  isChecked: false,

  setFormData: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  toggleCheckbox: (checked) => set({ isChecked: checked }),

  reset: () =>
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
