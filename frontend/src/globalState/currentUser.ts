import { User as FirebaseUser } from "firebase/auth";
import { createContext } from "react";

export const CurrentFirebaseUserContext = createContext<
  [FirebaseUser | null, (user: FirebaseUser | null) => void]
>([null, () => {}]);
