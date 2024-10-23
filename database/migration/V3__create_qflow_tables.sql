CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Add column to "users" table
ALTER TABLE "users" ADD COLUMN "uuid" UUID NOT NULL UNIQUE DEFAULT gen_random_uuid();

-- "questions" table
CREATE TABLE "questions"(
    "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "summary" TEXT NULL,
    "finished_at" TIMESTAMP WITHOUT TIME ZONE,
    "user_uuid" UUID NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "doc_vector" vector(1536) NOT NULL,
    FOREIGN KEY("user_uuid") REFERENCES "users"("uuid")
);

-- "tags" table
CREATE TABLE "tags"(
    "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL
);

-- "question_tags" table
CREATE TABLE "question_tags"(
    "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "question_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    UNIQUE("question_id", "tag_id"),
    FOREIGN KEY("question_id") REFERENCES "questions"("id"),
    FOREIGN KEY("tag_id") REFERENCES "tags"("id")
);

-- "topics" table
CREATE TABLE "topics"(
    "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "question_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "is_default_topic" BOOLEAN NOT NULL,
    FOREIGN KEY("question_id") REFERENCES "questions"("id")
);

-- "topic_comments" table
CREATE TABLE "topic_comments"(
    "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "topic_id" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "type" VARCHAR(255) CHECK ("type" IN ('suggest', 'question', 'answer')) NOT NULL,
    FOREIGN KEY("user_uuid") REFERENCES "users"("uuid"),
    FOREIGN KEY("topic_id") REFERENCES "topics"("id")
);

-- "question_comments" table
CREATE TABLE "question_comments"(
    "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    "question_id" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "type" VARCHAR(255) CHECK ("type" IN ('suggest', 'question', 'answer')) NOT NULL,
    FOREIGN KEY("question_id") REFERENCES "questions"("id"),
    FOREIGN KEY("user_uuid") REFERENCES "users"("uuid")
);