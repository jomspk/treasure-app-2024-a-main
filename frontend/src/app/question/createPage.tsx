import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { initialTopics } from "../../client/InitialTopics";
import { convertToString } from "../../client/convertToString";
import { useQueryMe } from "../../client/me";
import {
  useMutationCreateQuestion,
  useMutationRecommendTopics,
} from "../../client/question";
import MessageModal from "../../components/MessageModal";
import QuestionCarousel from "../../components/QuestionCarousel";
import Topic from "../../components/QuestionSide/Topic/Topic";

type Topic = {
  title: string;
  description: string;
  isDefaultTopic: boolean;
};

const CreatePage = () => {
  const [topics, setTopics] = useState(initialTopics);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const recommendTopicsData = useMutationRecommendTopics();
  const [recommendTopics, setRecommendTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const me = useQueryMe();
  const createQuestion = useMutationCreateQuestion();

  const plainTopic = { title: "", description: "", isDefaultTopic: false };

  const addTopic = (topic: Topic) => {
    setTopics([...topics, topic]);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const deleteTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const updateTopic = (index: number, updatedTopic: Topic) => {
    setTopics(topics.map((topic, i) => (i === index ? updatedTopic : topic)));
  };

  const excludeEmptyTopics = (topics: Topic[]) => {
    return topics.filter(
      (topic) => topic.title !== "" && topic.description !== "",
    );
  };

  const submitQuestion = () => {
    setIsSubmitLoading(true);
    const data = {
      userId: me.data?.id || "",
      tags: [],
      topics: excludeEmptyTopics(topics),
    };
    createQuestion.mutate(data, {
      onSuccess: (result) => {
        setTopics(initialTopics);
        const newQuestionId = result?.data as string;
        if (newQuestionId) {
          setQuestionId(newQuestionId);
          handleModalOpen();
        }
        setIsSubmitLoading(false);
      },
    });
  };

  const getRecommendTopics = async () => {
    setIsLoading(true);
    const context = convertToString(topics);
    const data = { docString: context };
    recommendTopicsData.mutate(data, {
      onSuccess: (result) => {
        setIsLoading(false);
        setRecommendTopics(result.data as string[]);
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      key={topics.length}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          gap: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {topics.map((topic, index) => (
          <Topic
            key={`topic${index}`}
            topic={topic}
            deleteTopic={() => deleteTopic(index)}
            updateTopic={(updatedTopic) => updateTopic(index, updatedTopic)}
          />
        ))}
        <Button
          variant="contained"
          onClick={() => {
            addTopic(plainTopic);
          }}
        >
          トピックを追加
        </Button>
        <Button variant="contained" onClick={getRecommendTopics}>
          追加で聞かれている質問を見る
        </Button>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <QuestionCarousel contents={recommendTopics} addTopic={addTopic} />
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          marginTop: "20px",
        }}
      >
        <Button
          variant="outlined"
          onClick={submitQuestion}
          disabled={isSubmitLoading}
        >
          <Typography>質問を作成</Typography>
        </Button>
        {isSubmitLoading && (
          <CircularProgress
            size={100}
            sx={{
              color: "primary.main",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
        {questionId && (
          <MessageModal
            name={me.data?.name || "[あなたの名前]"}
            questionId={questionId}
            open={isModalOpen}
            onClose={handleModalClose}
          />
        )}
      </Box>
    </div>
  );
};

export default CreatePage;
