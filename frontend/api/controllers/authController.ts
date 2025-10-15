import axiosInstance from "@/api/axiosInstance";

//register user
export const registerUser = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}) => {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
};

//login user 
export const loginUser = async (
    email: string,
    password: string
)=>{
    const response = await axiosInstance.post("/login", {email, password});
    return response.data;
};

//verify otp
export const verifyOtp = async (otp: string) => {
    const response = await axiosInstance.post("/verify-otp", { otp });
    return response.data;
}

//resend otp
export const resendOtp = async () => {
    const response = await axiosInstance.post("/resend-otp");
    return response.data;
};

//logout user
export const logoutUser = async () => {
    const response = await axiosInstance.post("/logout");
    return response.data;
};