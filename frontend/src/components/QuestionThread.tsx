import { Divider, Stack } from "@mui/material";
import React, { ComponentProps } from "react";
import { useParams } from "react-router-dom";
import { useMutationCreateQuestionComment } from "../client/comment";
import { components } from "../openapi/schema";
import Comment from "./Comment";
import InputComment from "./InputComment";

type QuestionCommentType = components["schemas"]["QuestionComment"];
type Props = {
  comments: QuestionCommentType[];
};

const QuestionThread: React.FC<Props> = ({ comments }) => {
  const params = useParams();
  const { questionId } = params;
  const stringQuestionId: string = questionId || "";

  const createQuestionComment = useMutationCreateQuestionComment();
  const onComment: ComponentProps<typeof InputComment>["onSubmit"] = (
    comment,
  ) => {
    return createQuestionComment.mutate({
      type: comment.type,
      content: comment.content,
      questionId: stringQuestionId,
    });
  };

  return (
    <Stack>
      {comments.map((comment) => (
        <Comment key={`comment-${comment.id}`} comment={comment} />
      ))}
      <Divider sx={{ my: 1 }} />
      <InputComment onSubmit={onComment} />
    </Stack>
  );
};

export default QuestionThread;
