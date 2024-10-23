import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from ".";
import { useSignIn } from "../auth";
import { components } from "../openapi/schema";
import { useQueryMe } from "./me";

const getQuestion = async (questionId: string) => {
  return await client.GET("/questions/{questionId}", {
    params: {
      path: { questionId: questionId },
    },
  });
};

export const useQueryQuestion = (questionId: string) => {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestion(questionId),
  });
};

type QuestionRequest = {
  userId: string;
  topics: TopicRequest[];
  tags: Tag[];
};
type Topic = components["schemas"]["Topic"];
type Tag = components["schemas"]["Tag"];
type TopicRequest = Pick<Topic, "title" | "description" | "isDefaultTopic">;

const createQuestion = async (data: QuestionRequest) => {
  return client.POST("/questions", {
    body: data,
  });
};

export const useMutationCreateQuestion = () => {
  const queryClient = useQueryClient();
  const me = useQueryMe();
  const handleSignIn = useSignIn();

  const mutationFn = async (data: QuestionRequest) => {
    if (!me.data) {
      handleSignIn({ withAlert: true });
      return;
    }

    return createQuestion(data);
  };
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["question"],
      });
    },
  });
};
export const updateFinishedAtQuestion = async (questionId: string) => {
  return client.POST("/questions/{questionId}/resolve", {
    params: {
      path: {
        questionId: questionId,
      },
    },
  });
};

type RecommendRequest = {
  docString: string;
};

const recommendTopics = async (data: RecommendRequest) => {
  return client.POST("/recommend", {
    body: data,
  });
};

export const useMutationRecommendTopics = () => {
  const queryClient = useQueryClient();
  const mutationFn = async (data: RecommendRequest) => recommendTopics(data);
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recommend"],
      });
    },
  });
};
