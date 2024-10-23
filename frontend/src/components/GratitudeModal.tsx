import { Box, Button, Fab, Modal } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { updateFinishedAtQuestion } from "../client/question";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "30px",
  boxShadow: 24,
  p: 4,
};

const answerFinishButtonStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
};

interface GratitudeModalProps {
  questionId: string;
}

const GratitudeModal: React.FC<GratitudeModalProps> = ({ questionId }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = async () => {
    setOpen(true);
    await updateFinishedAtQuestion(questionId);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Fab
        onClick={handleOpen}
        variant="extended"
        color="primary"
        sx={answerFinishButtonStyle}
      >
        解答完了！🎉
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            感謝のメッセージを送って閉じましょう！🎉
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, display: "flex", justifyContent: "center" }}
          >
            <Button onClick={handleClose}>閉じる</Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default GratitudeModal;
