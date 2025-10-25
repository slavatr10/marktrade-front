import axios from "@/config/axios";
import type { TelegramAuthResponse, TokenResponse } from "@/types";
import { AxiosError } from "axios";

export const refreshToken = async (): Promise<string> => {
  const token = sessionStorage.getItem("refresh_token");

  try {
    const response = await axios.post<TokenResponse>(
      "/auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { accessToken, refreshToken } = response.data;

    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);

    return accessToken;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "Error occurred while refreshing the token:",
        error.message
      );
    }
    throw error;
  }
};

export const getAuthTelegram = async (user_id: string) => {
  try {

    const response = await axios.get<TelegramAuthResponse>(
      `/auth/${user_id}/validate`
    );
    const accessToken = response.data?.tokens?.accessToken;
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    return {
      data: response.data,
      status: response.status,
      isError: false,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      console.warn(
        `API returned status ${error.response.status} for user ${user_id}`
      );

      return {
        data: error.response.data, 
        status: error.response.status,
        isError: true,
      };
    }
    console.error(
      `Critical error fetching auth data for user ${user_id}:`,
      error
    );
    throw error;
  }
};
