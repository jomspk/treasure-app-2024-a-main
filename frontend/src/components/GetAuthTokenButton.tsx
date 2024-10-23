import { Alert, Button, Snackbar } from "@mui/material";
import { User as FirebaseUser } from "firebase/auth";
import { useState } from "react";

const MESSAGE_DURATION = 30000;

export function GetAuthTokenButton(props: {
  firebaseUser: FirebaseUser | null;
}) {
  const [open, setOpen] = useState(false);
  const firebaseUser = props.firebaseUser;
  if (firebaseUser === null) {
    return null;
  }
  return (
    <>
      <Button
        color="inherit"
        onClick={() => {
          setOpen(false);
          firebaseUser
            .getIdToken()
            .then((token) => navigator.clipboard.writeText(token))
            .then(() => setOpen(true));
        }}
      >
        copy token
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={MESSAGE_DURATION}
        onClose={() => setOpen(false)}
      >
        <Alert severity="info">API tokenをコピーしました</Alert>
      </Snackbar>
    </>
  );
}
