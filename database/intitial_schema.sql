CREATE DATABASE bookmarkhub;

\c bookmarkhub;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    url TEXT NOT NULL CHECK (url ~* '^https?://'),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bookmark_id INTEGER REFERENCES bookmarks(id) ON DELETE CASCADE,
    value SMALLINT NOT NULL CHECK (value IN (-1, 1)),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, bookmark_id)
);

-- Indexes for performance
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_votes_bookmark ON votes(bookmark_id);
