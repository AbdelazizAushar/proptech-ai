create or replace function match_chunks(
  query_embedding vector(512),
  match_listing_id uuid,
  match_count int default 3
)
returns table(content text, image_url text, type text, similarity float)
language sql as $$
  select 
    content,
    image_url,
    type,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_base
  where listing_id = match_listing_id
  order by embedding <=> query_embedding
  limit match_count;
$$;