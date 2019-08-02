DROP TABLE IF EXISTS tracked_games;

CREATE TABLE tracked_games (
	id SERIAL PRIMARY KEY,
	game_id VARCHAR(20) UNIQUE,
	name VARCHAR(225),
	box_art_url VARCHAR(225)
);
