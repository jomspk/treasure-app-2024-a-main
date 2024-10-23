import { Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useQueryQuestion } from "../../client/question";
import GratitudeModal from "../../components/GratitudeModal";
import QuestionThread from "../../components/QuestionThread";
import TopicThread from "../../components/TopicThread";

const QuestionPage: React.FC = () => {
  const params = useParams();
  const { questionId } = params;
  const stringQuestionId: string = questionId || "";
  const { data, isError, isLoading, isPending } =
    useQueryQuestion(stringQuestionId);
  const question = data?.data;

  if (isPending || isLoading || !question) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Stack
      p={2}
      sx={
        question.finishedAt
          ? { paddingBottom: "70px", opacity: 0.33 }
          : { paddingBottom: "70px" }
      }
    >
      <Stack spacing={2} p={2}>
        <Typography fontWeight="bold" fontSize={18}>
          要約
        </Typography>
        <Typography>{question.summary}</Typography>
      </Stack>
      <Divider sx={{ my: 4 }} />
      {question.topics &&
        question.topics.map((topic) => (
          <TopicThread key={topic.id} topic={topic} />
        ))}
      <Divider sx={{ my: 4 }} />
      <Stack spacing={2} p={2}>
        <Typography fontWeight="bold" fontSize={18}>
          質問全体へのコメント
        </Typography>
        {question.comments && <QuestionThread comments={question.comments} />}
        <GratitudeModal questionId={stringQuestionId} />
      </Stack>
    </Stack>
  );
};
export default QuestionPage;
