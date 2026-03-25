CREATE OR REPLACE FUNCTION upsert_conversation(
  p_conversation_id UUID,
  p_user_id UUID,
  p_listing_id UUID,
  p_user_message JSONB,
  p_bot_message JSONB
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_conversation_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM conversations WHERE id = p_conversation_id
  ) THEN
    -- Append both messages to existing conversation
    UPDATE conversations
    SET
      messages = messages || jsonb_build_array(p_user_message, p_bot_message),
      updated_at = now()
    WHERE id = p_conversation_id;
  ELSE
    -- Create new conversation
    INSERT INTO conversations (id, user_id, listing_id, messages, status, created_at)
    VALUES (
      gen_random_uuid(),
      p_user_id,
      p_listing_id,
      jsonb_build_array(p_user_message, p_bot_message),
      'active',
      now()
    );
  END IF;
END;
$$;