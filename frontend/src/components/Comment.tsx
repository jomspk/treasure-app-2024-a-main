import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { components } from "../openapi/schema";
type CommentType = Pick<
  components["schemas"]["TopicComment"],
  "createdAt" | "type" | "content" | "userId"
>; // TopicCommentでもQuestionCommentでも共通のもののみを指定
type Props = {
  comment: CommentType;
};

const CommentType = {
  question: {
    label: "質問",
    color: "#fca5a5",
  },
  suggest: {
    label: "提案",
    color: "#3b82f6",
  },
  answer: {
    label: "回答",
    color: "#10b981",
  },
};

const Comment: React.FC<Props> = ({ comment }) => {
  return (
    <Stack
      sx={{
        width: "full",
        p: 2,
        borderRadius: 1,
        ":hover": {
          bgcolor: "#eee",
        },
      }}
    >
      <div
        style={{
          backgroundColor: CommentType[comment.type].color,
          borderRadius: "2px",
          padding: "4px 8px",
          fontSize: 14,
          color: "white",
          fontWeight: "bold",
          width: "fit-content",
        }}
      >
        {CommentType[comment.type].label}
      </div>
      <Typography color="darkgray" fontSize={12}>
        {dayjs(comment.createdAt).format("YYYY/MM/DD HH:mm")}
      </Typography>
      <Typography>{comment.content}</Typography>
    </Stack>
  );
};

export default Comment;
