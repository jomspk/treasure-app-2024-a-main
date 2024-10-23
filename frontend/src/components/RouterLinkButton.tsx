// NOTE: MUI のコンポーネントでクライアントルーティングするためのカスタムコンポーネント
// REF: https://reactrouter.com/en/main/components/link

import { Button, ButtonProps } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";

export function RouterLinkButton(props: ButtonProps & { to: string }) {
  return <Button component={ReactRouterLink} {...props} />;
}
