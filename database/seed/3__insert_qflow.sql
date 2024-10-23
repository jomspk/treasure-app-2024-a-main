INSERT INTO questions (id, summary, finished_at, user_uuid, doc_vector) VALUES
    ('01626d37-7cf1-4d89-bce1-b522f7698993','コミュニケーションは全ての根幹', NULL, '725903cf-742c-4b71-9e47-10a00e14b9f3', ARRAY(SELECT RANDOM() FROM generate_series(1, 1536))),
    ('d8ffef95-74c1-4744-b8ab-dc765bf0db77','オープンに話そう', NULL, 'd63b6002-8151-4d63-8b7d-31598834f4ee', ARRAY(SELECT RANDOM() FROM generate_series(1, 1536))),
    ('99af0728-35c5-4165-9c41-7d16b5d4fd8f','ユーザが触れるようになって初めて価値を生む', NULL, 'fd0bd403-67dd-44a7-9532-9bb1edb4b169', ARRAY(SELECT RANDOM() FROM generate_series(1, 1536)));

INSERT INTO tags (id, name) VALUES
    ('168c30dd-2154-45ec-8dd0-53bccddf8299','tag1'),
    ('64f8a5c8-c6e8-464b-b904-c5884dbdbc1b', 'tag2'),
    ('63ce45f3-6590-49b1-80f3-f6b761c57490', 'tag3');

-- questionを作成すると、UUIDがバックエンド側にリターンされる仕様になっているから、そこで取得したUUIDを使ってquestion_tagsを作る
INSERT INTO question_tags (question_id, tag_id) VALUES
    ('01626d37-7cf1-4d89-bce1-b522f7698993', '168c30dd-2154-45ec-8dd0-53bccddf8299'),
    ('01626d37-7cf1-4d89-bce1-b522f7698993', '64f8a5c8-c6e8-464b-b904-c5884dbdbc1b'),
    ('d8ffef95-74c1-4744-b8ab-dc765bf0db77', '168c30dd-2154-45ec-8dd0-53bccddf8299'),
    ('d8ffef95-74c1-4744-b8ab-dc765bf0db77', '63ce45f3-6590-49b1-80f3-f6b761c57490'),
    ('99af0728-35c5-4165-9c41-7d16b5d4fd8f', '64f8a5c8-c6e8-464b-b904-c5884dbdbc1b'),
    ('99af0728-35c5-4165-9c41-7d16b5d4fd8f', '63ce45f3-6590-49b1-80f3-f6b761c57490');

INSERT INTO topics (id, question_id, title, description, is_default_topic) VALUES
    ('ecc64956-9595-4409-8aca-3040d6acaddf', '01626d37-7cf1-4d89-bce1-b522f7698993', 'topic1', 'topic1 description', TRUE),
    ('36a38f3f-9caf-4523-a394-6ca431b8bd81', 'd8ffef95-74c1-4744-b8ab-dc765bf0db77', 'topic2', 'topic2 description', TRUE),
    ('a896b788-6eb3-4db8-9028-44f00876e4ec', '99af0728-35c5-4165-9c41-7d16b5d4fd8f', 'topic3', 'topic3 description', TRUE);

INSERT INTO topic_comments (topic_id, user_uuid, content, type) VALUES
    ('ecc64956-9595-4409-8aca-3040d6acaddf', '725903cf-742c-4b71-9e47-10a00e14b9f3', 'topic1 comment1', 'suggest'),
    ('ecc64956-9595-4409-8aca-3040d6acaddf', 'd63b6002-8151-4d63-8b7d-31598834f4ee', 'topic1 comment2', 'question'),
    ('ecc64956-9595-4409-8aca-3040d6acaddf', 'fd0bd403-67dd-44a7-9532-9bb1edb4b169', 'topic1 comment3', 'answer'),
    ('36a38f3f-9caf-4523-a394-6ca431b8bd81', '725903cf-742c-4b71-9e47-10a00e14b9f3', 'topic2 comment1', 'suggest'),
    ('36a38f3f-9caf-4523-a394-6ca431b8bd81', 'd63b6002-8151-4d63-8b7d-31598834f4ee', 'topic2 comment2', 'question'),
    ('36a38f3f-9caf-4523-a394-6ca431b8bd81', 'fd0bd403-67dd-44a7-9532-9bb1edb4b169', 'topic2 comment3', 'answer'),
    ('a896b788-6eb3-4db8-9028-44f00876e4ec', '725903cf-742c-4b71-9e47-10a00e14b9f3', 'topic3 comment1', 'suggest'),
    ('a896b788-6eb3-4db8-9028-44f00876e4ec', 'd63b6002-8151-4d63-8b7d-31598834f4ee', 'topic3 comment2', 'question');

INSERT INTO question_comments (question_id, user_uuid, content, type) VALUES
    ('01626d37-7cf1-4d89-bce1-b522f7698993', '725903cf-742c-4b71-9e47-10a00e14b9f3', 'question1 comment1', 'suggest'),
    ('01626d37-7cf1-4d89-bce1-b522f7698993', 'd63b6002-8151-4d63-8b7d-31598834f4ee', 'question1 comment2', 'question'),
    ('01626d37-7cf1-4d89-bce1-b522f7698993', 'fd0bd403-67dd-44a7-9532-9bb1edb4b169', 'question1 comment3', 'answer'),
    ('d8ffef95-74c1-4744-b8ab-dc765bf0db77', '725903cf-742c-4b71-9e47-10a00e14b9f3', 'question2 comment1', 'suggest'),
    ('d8ffef95-74c1-4744-b8ab-dc765bf0db77', 'd63b6002-8151-4d63-8b7d-31598834f4ee', 'question2 comment2', 'question'),
    ('d8ffef95-74c1-4744-b8ab-dc765bf0db77', 'fd0bd403-67dd-44a7-9532-9bb1edb4b169', 'question2 comment3', 'answer'),
    ('99af0728-35c5-4165-9c41-7d16b5d4fd8f', '725903cf-742c-4b71-9e47-10a00e14b9f3', 'question3 comment1', 'suggest');