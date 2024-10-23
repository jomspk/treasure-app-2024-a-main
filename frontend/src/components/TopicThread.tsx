import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import React, { ComponentProps } from "react";
import { useMutationCreateTopicComment } from "../client/comment";
import { components } from "../openapi/schema";
import Comment from "./Comment";
import InputComment from "./InputComment";

type TopicType = components["schemas"]["Topic"];
type Props = {
  topic: TopicType;
};

const TopicThread: React.FC<Props> = ({ topic }) => {
  const createTopicComment = useMutationCreateTopicComment();

  const onComment: ComponentProps<typeof InputComment>["onSubmit"] = (
    comment,
  ) => {
    return createTopicComment.mutate({
      type: comment.type,
      content: comment.content,
      topicId: topic.id,
    });
  };

  return (
    <Accordion
      sx={{
        border: "1px solid lightgray",
      }}
      elevation={0}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderRadius: 1,
          bgcolor: "#eee",
        }}
      >
        <Typography component="h3" fontWeight="bold">
          {topic.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            p: 2,
          }}
        >
          {topic.description}
        </Box>
        <Divider sx={{ my: 2 }} />
        {topic.comments.map((comment) => (
          <Comment key={`comment-${comment.id}`} comment={comment} />
        ))}
        <Divider sx={{ my: 1 }} />
        <InputComment onSubmit={onComment} />
      </AccordionDetails>
    </Accordion>
  );
};

export default TopicThread;
