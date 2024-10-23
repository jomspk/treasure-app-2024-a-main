// NOTE: MUI のコンポーネントでクライアントルーティングするためのカスタムコンポーネント
// REF: https://reactrouter.com/en/main/components/link

import { ButtonProps, IconButton } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";

export function RouterLinkIconButton(props: ButtonProps & { to: string }) {
  return <IconButton component={ReactRouterLink} {...props} />;
}
