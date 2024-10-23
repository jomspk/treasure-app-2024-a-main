import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from ".";
import { useSignIn } from "../auth";
import { QuestionCommentType, TopicCommentType } from "../types/comment";
import { useQueryMe } from "./me";

const createTopicComment = async (
  comment: Pick<TopicCommentType, "type" | "content" | "userId" | "topicId">,
) => {
  return await client.POST("/topics/{topicId}/comments", {
    body: comment,
    params: {
      path: {
        topicId: comment.topicId,
      },
    },
  });
};

export const useMutationCreateTopicComment = () => {
  const me = useQueryMe();
  const queryClient = useQueryClient();
  const handleSignIn = useSignIn();

  const mutationFn = async (
    comment: Pick<TopicCommentType, "type" | "content" | "topicId">,
  ) => {
    if (!me.data) {
      handleSignIn({ withAlert: true });
      return;
    }

    return createTopicComment({ ...comment, userId: me.data.id });
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["question"], // GET: questionでまとめて紐づくコメントを全部取得してるので、question自体を更新する必要がある
      });
    },
  });
};

const createQuestionComment = async (
  comment: Pick<
    QuestionCommentType,
    "type" | "content" | "userId" | "questionId"
  >,
) => {
  const { questionId } = comment;
  return await client.POST("/questions/{questionId}/comments", {
    body: comment,
    params: {
      path: {
        questionId: questionId,
      },
    },
  });
};

export const useMutationCreateQuestionComment = () => {
  const me = useQueryMe();
  const queryClient = useQueryClient();
  const handleSignIn = useSignIn();

  const mutationFn = async (
    comment: Pick<QuestionCommentType, "type" | "content" | "questionId">,
  ) => {
    if (!me.data) {
      handleSignIn({ withAlert: true });
      return;
    }

    return createQuestionComment({ ...comment, userId: me.data.id });
  };

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["question"], // GET: questionでまとめて紐づくコメントを全部取得してるので、question自体を更新する必要がある
      });
    },
  });
};
