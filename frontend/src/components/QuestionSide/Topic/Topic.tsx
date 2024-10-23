import { TextField } from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { components } from "../../../openapi/schema";
import CloseButton from "../../atoms/CloseBtn";

type TopicType = components["schemas"]["Topic"];
type PickedTopic = Pick<TopicType, "title" | "description" | "isDefaultTopic">;

type Props = {
  topic: PickedTopic;
  deleteTopic: () => void;
  updateTopic: (updatedTopic: PickedTopic) => void;
};

const Topic: React.FC<Props> = ({ topic, deleteTopic, updateTopic }) => {
  const { control, watch } = useForm({
    defaultValues: topic,
  });
  useEffect(() => {
    const subscription = watch((value) => updateTopic(value as PickedTopic));
    return () => subscription.unsubscribe();
  }, [watch, updateTopic]);

  return (
    <form>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: "このフィールドは必須です" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="トピックのタイトル"
              variant="standard"
              error={!!error}
              helperText={error ? error.message : null}
              sx={{ mb: 2 }}
            />
          )}
        />
        <CloseButton onClick={deleteTopic} />
      </div>
      <Controller
        name="description"
        control={control}
        defaultValue=""
        rules={{ required: "このフィールドは必須です" }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            multiline
            fullWidth
            rows={4}
            label="トピックの説明"
            variant="outlined"
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
      />
    </form>
  );
};

export default Topic;
