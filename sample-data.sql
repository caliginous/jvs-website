-- Sample data for testing D1 system
INSERT INTO content (id,type,slug,title,body_json,body_html,summary,source,source_id,updated_at,published_at,version) 
VALUES (
  'test:1', 
  'article', 
  'sample-article', 
  'Sample Article from D1', 
  '{"title":"Sample Article","content":"This is a test article"}', 
  '<h1>Sample Article</h1><p>This is a test article loaded from the new D1 database system!</p><p>This demonstrates that the migration is working correctly.</p>', 
  'A sample article for testing the D1 system', 
  'test', 
  '1', 
  '2025-01-07T22:00:00Z', 
  '2025-01-07T22:00:00Z', 
  1
);

INSERT INTO content (id,type,slug,title,body_json,body_html,summary,source,source_id,updated_at,published_at,version) 
VALUES (
  'test:2', 
  'post', 
  'another-sample-post', 
  'Another Sample Post', 
  '{"title":"Another Sample Post","content":"This is another test post"}', 
  '<h1>Another Sample Post</h1><p>This is another test post to verify the listing functionality.</p><p>It shows that both articles and posts are displayed correctly.</p>', 
  'Another sample post for testing', 
  'test', 
  '2', 
  '2025-01-07T21:30:00Z', 
  '2025-01-07T21:30:00Z', 
  1
);

-- Add some sample tags
INSERT INTO content_tag (content_id, tag) VALUES ('test:1', 'testing');
INSERT INTO content_tag (content_id, tag) VALUES ('test:1', 'd1-database');
INSERT INTO content_tag (content_id, tag) VALUES ('test:2', 'sample');
INSERT INTO content_tag (content_id, tag) VALUES ('test:2', 'migration');
