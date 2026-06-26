import axiosBase from "@/services/axios/axiosBase";
import { AUTH } from "@/constants/apiRoutes";

/**
 * Step 1 — Request a password-reset OTP.
 * Always resolves (API returns 200 regardless of whether email exists).
 */
export const requestPasswordReset = (email) =>
  axiosBase.post(AUTH.FORGOT_PASSWORD, { email });

/**
 * Step 2 — Verify the OTP.
 * Returns { reset_token } on success.
 */
export const verifyResetOTP = (email, otp) =>
  axiosBase.post(AUTH.VERIFY_RESET_OTP, { email, otp });

/**
 * Step 3 — Submit new password with the reset token from step 2.
 */
export const resetPassword = (email, reset_token, new_password) =>
  axiosBase.post(AUTH.RESET_PASSWORD, { email, reset_token, new_password });