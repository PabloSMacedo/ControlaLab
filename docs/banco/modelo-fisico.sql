CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    perfil VARCHAR(50)
);

CREATE TABLE equipamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    patrimonio VARCHAR(50),
    localizacao VARCHAR(100),
    status VARCHAR(50)
);

CREATE TABLE manutencao (
    id SERIAL PRIMARY KEY,
    equipamento_id INTEGER REFERENCES equipamento(id),
    tipo VARCHAR(50),
    descricao TEXT,
    data DATE
);

CREATE TABLE agendamento (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuario(id),
    equipamento_id INTEGER REFERENCES equipamento(id),
    data_inicio TIMESTAMP,
    data_fim TIMESTAMP
);