CREATE OR REPLACE FUNCTION match_knowledge_base(
  query_embedding VECTOR(512),
  p_listing_id UUID,
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  listing_id UUID,
  content TEXT,
  image_url TEXT,
  type TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
    SELECT
      kb.id,
      kb.listing_id,
      kb.content,
      kb.image_url,
      kb.type,
      1 - (kb.embedding <=> query_embedding) AS similarity
    FROM knowledge_base kb
    WHERE
      kb.listing_id = p_listing_id
      AND 1 - (kb.embedding <=> query_embedding) >= match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;