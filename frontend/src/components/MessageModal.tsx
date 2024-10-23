import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import * as React from "react";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

type MessageModalProps = {
  name: string;
  questionId: string;
  open: boolean;
  onClose: () => void;
};

const MessageModal: React.FC<MessageModalProps> = ({
  name,
  questionId,
  open,
  onClose,
}) => {
  const url: string = `https://group-a.treasure.tech-dojo.net/question/${questionId}`;
  const message: string = `${name}さんが質問しています。こちらのリンクを確認してください。${url}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      alert("クリップボードにコピーされました！");
    } catch (err) {
      console.error("クリップボードへのコピーに失敗しました:", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          ページが作成されました
        </Typography>
        <TextField
          fullWidth
          multiline
          variant="outlined"
          value={message}
          InputProps={{
            readOnly: true,
            // ここでTextFieldの中にコピーするボタンを配置
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Copy to Clipboard" placement="top" arrow>
                  <IconButton color="primary" onClick={copyToClipboard}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Typography variant="body1" sx={{ mb: 2 }}>
          回答して欲しい人に送信してください
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={onClose} sx={{ ml: 2 }}>
            閉じる
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MessageModal;
