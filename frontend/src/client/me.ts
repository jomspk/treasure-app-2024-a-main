import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getClientWithAuthHeader } from ".";
import { CurrentFirebaseUserContext } from "../globalState/currentUser";
import type { components } from "../openapi/schema";
import { User } from "../types/user";

const convert = (user: components["schemas"]["OriginalUser"]): User => {
  return {
    id: user.id,
    name: user?.name ?? "",
    photoUrl: user?.photoUrl ?? "",
  };
};

const fetchMe = async (token: string) => {
  const clientWithAuthHeader = getClientWithAuthHeader(token);
  const res = await clientWithAuthHeader.GET("/users/me");

  if (res.response.status !== 200) {
    const res = await clientWithAuthHeader.POST("/users/me/register");

    if (!res.data) {
      return null;
    }

    return convert(res.data);
  }

  if (!res.data) {
    return null;
  }

  return convert(res.data);
};

export const useQueryMe = () => {
  const [firebaseUser] = useContext(CurrentFirebaseUserContext);

  const queryFn: () => Promise<User | null> = async () => {
    if (!firebaseUser) {
      return null;
    }

    const token = await firebaseUser.getIdToken();

    return fetchMe(token);
  };

  return useQuery({
    queryKey: ["me", firebaseUser?.uid],
    queryFn,
  });
};
