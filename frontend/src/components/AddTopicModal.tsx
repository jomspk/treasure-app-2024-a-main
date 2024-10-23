import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

type AddTopicModalProps = {
  open: boolean;
  onClose: () => void;
  content: string;
  onAdd: (title: string, description: string) => void;
};

const AddTopicModal: React.FC<AddTopicModalProps> = ({
  open,
  onClose,
  content,
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    onAdd(title, description);
    setTitle("");
    setDescription("");
  };

  const handleClose = () => {
    onClose();
    setTitle("");
    setDescription("");
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          コメント: {content}
        </Typography>
        <TextField
          label="トピックのタイトル"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          label="トピックの説明"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button onClick={handleClose} sx={{ mt: 2 }}>
          閉じる
        </Button>
        <Button onClick={handleAdd} sx={{ mt: 2, ml: 2 }}>
          追加する
        </Button>
      </Box>
    </Modal>
  );
};

export default AddTopicModal;
