import { AuthBodyType } from "@/types/constants/Request";

export const authBody: AuthBodyType = {
  grant_type: "client_credentials",
  client_id: import.meta.env.VITE_CLIENT_ID,
  client_secret: import.meta.env.VITE_CLIENT_SECRET,
};

