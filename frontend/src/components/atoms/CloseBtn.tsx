import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

type Props = {
  onClick: () => void;
};

const CloseButton = ({ onClick }: Props) => {
  return (
    <IconButton aria-label="close" onClick={onClick}>
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
