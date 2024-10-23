import { useQueryClient } from "@tanstack/react-query";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useContext } from "react";
import { CurrentFirebaseUserContext } from "./globalState/currentUser";

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const auth = getAuth(firebaseApp);

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const [, setCurrentUser] = useContext(CurrentFirebaseUserContext);

  return async ({ withAlert }: { withAlert?: boolean }) => {
    if (withAlert) alert("Googleアカウントでログインをしてください");

    return await signInWithPopup(auth, new GoogleAuthProvider())
      .then((res) => {
        setCurrentUser(res.user);
        queryClient.invalidateQueries({
          queryKey: ["me"],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

export const useSignOut = () => {
  const [, setCurrentUser] = useContext(CurrentFirebaseUserContext);

  return async () => {
    await signOut(auth)
      .then(() => {
        setCurrentUser(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
