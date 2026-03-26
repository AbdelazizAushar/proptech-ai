CREATE OR REPLACE FUNCTION get_or_create_user(p_whatsapp_number TEXT)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
BEGIN
  -- Try to find existing user
  IF EXISTS (SELECT 1 FROM users WHERE whatsapp_number = p_whatsapp_number) THEN
    RETURN QUERY
      SELECT * FROM users WHERE whatsapp_number = p_whatsapp_number;
  ELSE
    -- Create new user
    RETURN QUERY
      INSERT INTO users (id, whatsapp_number, created_at)
      VALUES (gen_random_uuid(), p_whatsapp_number, now())
      RETURNING *;
  END IF;
END;
$$;