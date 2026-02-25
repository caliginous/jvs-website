-- db/migrations/001_init.sql
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS content (
  id TEXT PRIMARY KEY,                 -- 'source:source_id'
  type TEXT NOT NULL,                  -- 'article' | 'recipe' | 'event' | ...
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  body_json TEXT NOT NULL,             -- canonical JSON (raw)
  body_html TEXT NOT NULL,             -- sanitized HTML for rendering
  summary TEXT,
  source TEXT NOT NULL,                -- 'wordpress' | 'sanity'
  source_id TEXT NOT NULL,             -- WP post ID or Sanity _id
  updated_at TEXT NOT NULL,            -- ISO timestamp
  published_at TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  deleted_at TEXT                      -- soft delete marker (NULL = active)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_updated_at ON content(updated_at);
CREATE INDEX IF NOT EXISTS idx_content_deleted ON content(deleted_at);

CREATE TABLE IF NOT EXISTS content_tag (
  content_id TEXT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  PRIMARY KEY (content_id, tag)
);

CREATE TABLE IF NOT EXISTS author (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT
);

CREATE TABLE IF NOT EXISTS content_author (
  content_id TEXT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES author(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, author_id)
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  original_url TEXT,
  r2_key TEXT,                         -- if mirrored to R2
  cdn_url TEXT,                        -- public CDN URL derived from R2
  width INTEGER,
  height INTEGER,
  alt TEXT
);

CREATE TABLE IF NOT EXISTS content_media (
  content_id TEXT NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  media_id TEXT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  role TEXT, -- 'hero', 'inline', etc.
  PRIMARY KEY (content_id, media_id)
);

CREATE TABLE IF NOT EXISTS source_cursor (
  source TEXT PRIMARY KEY,             -- 'wordpress' | 'sanity'
  last_seen TEXT NOT NULL              -- ISO timestamp
);