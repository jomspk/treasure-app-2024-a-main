import { Avatar, Button, IconButton, Stack } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useSignIn, useSignOut } from "../auth";
import { useQueryMe } from "../client/me";
import { RouterLinkButton } from "./RouterLinkButton";

export function Header() {
  const handleSignIn = useSignIn();
  const handleSignOut = useSignOut();
  const me = useQueryMe();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Stack direction="row" justifyContent="space-between" width="100%">
          <RouterLinkButton
            variant="text"
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
            to="/"
          >
            QFlow
          </RouterLinkButton>
          {me.data ? (
            <Stack direction="row" spacing={1}>
              <IconButton>
                <Avatar src={me.data.photoUrl} sx={{ width: 30, height: 30 }} />
              </IconButton>

              <Button
                color="inherit"
                onClick={handleSignOut}
                sx={{
                  fontWeight: "bold",
                }}
              >
                ログアウト
              </Button>
            </Stack>
          ) : (
            <Button
              color="inherit"
              onClick={() => handleSignIn({ withAlert: false })}
              sx={{
                fontWeight: "bold",
              }}
            >
              ログイン
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
