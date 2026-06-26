import { get, post } from "@/utils/apiHelpers";
import publicClient from "@/services/axios/publicClient";
import { AUTH } from "@/constants/apiRoutes";

export const getPublicRoles = () => get(AUTH.PUBLIC_ROLES, {}, publicClient);

export const signup = (data) => post(AUTH.SIGNUP, data, publicClient);

export const verifySignupOtp = (email, otp) => post(AUTH.SIGNUP_VERIFY, { email, otp }, publicClient);
