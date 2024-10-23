// NOTE: MUI のコンポーネントでクライアントルーティングするためのカスタムコンポーネント
// REF: https://reactrouter.com/en/main/components/link

import { Link, LinkProps } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";

export function RouterLink(props: LinkProps & { to: string }) {
  return <Link component={ReactRouterLink} {...props} />;
}
