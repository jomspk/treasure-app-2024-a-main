import createClient from "openapi-fetch";
import type { paths } from "../openapi/schema";

export const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

export const getClientWithAuthHeader = (token: string) => {
  return createClient<paths>({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
