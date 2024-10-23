import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

type QuestionCardProps = {
  content: string;
  onClick: () => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ content, onClick }) => {
  return (
    <Card onClick={onClick} sx={{ minWidth: 200, marginRight: 2 }}>
      <CardContent>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
