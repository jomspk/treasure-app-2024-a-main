import { Box } from "@mui/material";
import React, { useState } from "react";
import AddTopicModal from "./AddTopicModal";
import QuestionCard from "./QuestionCard";

type Props = {
  contents: string[];
  addTopic: (topic: {
    title: string;
    description: string;
    isDefaultTopic: boolean;
  }) => void;
};

const QuestionCarousel: React.FC<Props> = ({ contents, addTopic }) => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (content: string) => {
    setSelectedContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedContent(null);
  };

  const handleAdd = (title: string, description: string) => {
    addTopic({ title, description, isDefaultTopic: false });
    handleCloseModal();
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          p: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {contents.map((content, index) => (
          <QuestionCard
            key={index}
            content={content}
            onClick={() => handleOpenModal(content)}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <AddTopicModal
          open={modalOpen}
          onClose={handleCloseModal}
          onAdd={handleAdd}
          content={selectedContent || ""}
        />
      </Box>
    </Box>
  );
};

export default QuestionCarousel;
