CREATE TABLE public.tips (
    id SERIAL PRIMARY KEY,
    description VARCHAR(2000) NOT NULL,
    category SMALLINT NOT NULL,
    creator VARCHAR(36) NOT NULL
);

CREATE TABLE public.users (
    id VARCHAR(36) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id)
)