import SendIcon from "@mui/icons-material/Send";
import { Button, IconButton, Paper, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { components } from "../openapi/schema";

type QuestionCommentType = components["schemas"]["QuestionComment"];
const types: { [key in QuestionCommentType["type"]]: string } = {
  question: "質問",
  suggest: "提案",
  answer: "回答",
};

type Props = {
  onSubmit: (result: Pick<QuestionCommentType, "content" | "type">) => void;
  defaultType?: QuestionCommentType["type"];
};

const InputComment: React.FC<Props> = ({ onSubmit, defaultType }) => {
  const [comment, setComment] = useState("");
  const [type, setType] = useState<QuestionCommentType["type"]>(
    defaultType || "question", // defaultTypeが指定されていない場合は"question"をデフォルトにする
  );

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "full",
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1}>
        {Object.entries(types).map(([t, label]) => (
          <Button
            sx={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: "0px",
            }}
            key={t}
            variant={t === type ? "contained" : "outlined"}
            onClick={() => setType(t as QuestionCommentType["type"])} // Object.entriesをかますと型が消失するため、アサーションで対応
          >
            {label}
          </Button>
        ))}
      </Stack>
      <TextField
        multiline
        rows={2}
        sx={{}}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <IconButton
        sx={{
          ml: "auto",
        }}
        onClick={() => {
          onSubmit({ content: comment, type });
          setComment("");
        }}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};
export default InputComment;
