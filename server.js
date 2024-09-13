const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Configurando o Express
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'lucaspaiva',
    password: 'lucas.lp43',
    database: 'alunos'
});

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para buscar um aluno pelo ID
app.get('/alunos/:id', (req, res) => {
    const alunoId = req.params.id;
    console.log(`Buscando dados do aluno com ID: ${alunoId}`);

    const query = 'SELECT * FROM alunos WHERE id = ?';
    connection.query(query, [alunoId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar aluno:', err);
            res.status(500).send('Erro ao buscar aluno.');
            return;
        }

        if (results.length > 0) {
            console.log('Aluno encontrado:', results[0]);
            res.status(200).json(results[0]);  // Retorna o primeiro resultado
        } else {
            console.log('Aluno não encontrado.');
            res.status(404).send('Aluno não encontrado.');
        }
    });
});

// Rota para editar um aluno pelo ID
app.put('/alunos/:id', (req, res) => {
    const alunoId = req.params.id;
    const { nome, dataNascimento, idade, modalidade, faixa, horario, tipo, genero } = req.body;

    console.log(`Tentativa de atualização do aluno com ID: ${alunoId}`);
    console.log('Dados recebidos:', { nome, dataNascimento, idade, modalidade, faixa, horario, tipo, genero });

    const query = `
        UPDATE alunos 
        SET nome = ?, data_nascimento = ?, idade = ?, modalidade = ?, faixa = ?, horario = ?, tipo = ?, genero = ?
        WHERE id = ?
    `;

    connection.query(query, [nome, dataNascimento, idade, modalidade, faixa, horario, tipo, genero, alunoId], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar aluno:', err);
            res.status(500).send('Erro ao atualizar aluno.');
            return;
        }

        if (results.affectedRows > 0) {
            console.log(`Aluno com ID ${alunoId} atualizado com sucesso!`);
            res.status(200).send('Aluno atualizado com sucesso!');
        } else {
            console.log(`Aluno com ID ${alunoId} não encontrado para atualização.`);
            res.status(404).send('Aluno não encontrado para atualização.');
        }
    });
});

// Rota para apagar um aluno pelo ID
app.delete('/alunos/:id', (req, res) => {
    const alunoId = req.params.id;

    const query = 'DELETE FROM alunos WHERE id = ?';
    connection.query(query, [alunoId], (err, results) => {
        if (err) {
            console.error('Erro ao apagar aluno:', err);
            res.status(500).send('Erro ao apagar aluno.');
            return;
        }

        if (results.affectedRows > 0) {
            res.status(200).send('Aluno apagado com sucesso!');
        } else {
            res.status(404).send('Aluno não encontrado.');
        }
    });
});

// Rota para cadastrar um aluno (incluindo gênero)
app.post('/cadastrar', (req, res) => {
    const { nome, dataNascimento, idade, modalidade, faixa, horario, tipo, genero } = req.body;

    // Verifica a modalidade. Se não for Karaté, faixa será definida como NULL
    const faixaValue = modalidade === 'Karaté' ? faixa : null;

    // Log para depuração
    console.log("Tentativa de cadastro de aluno:", {
        nome, dataNascimento, idade, modalidade, faixaValue, horario, tipo, genero
    });

    // Inserindo os dados no banco de dados
    const query = `
        INSERT INTO alunos (nome, data_nascimento, idade, modalidade, faixa, horario, tipo, genero) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(query, [nome, dataNascimento, idade, modalidade, faixaValue, horario, tipo, genero], (err, results) => {
        if (err) {
            console.error('Erro ao inserir aluno:', err);
            res.status(500).send('Erro ao cadastrar o aluno.');
            return;
        }
        res.status(201).send('Aluno cadastrado com sucesso!');
    });
});

// Rota para listar alunos com filtros opcionais (horário, modalidade e tipo), ordenados por nome
app.get('/alunos', (req, res) => {
    const { modalidade, tipo, horario } = req.query;

    let query = 'SELECT * FROM alunos WHERE 1=1';
    const params = [];

    // Filtros opcionais
    if (modalidade) {
        query += ' AND modalidade = ?';
        params.push(modalidade);
    }
    if (tipo) {
        query += ' AND tipo = ?';
        params.push(tipo);
    }
    if (horario) {
        query += ' AND horario = ?';
        params.push(horario);
    }

    // Adiciona a ordenação por nome
    query += ' ORDER BY nome ASC';

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar alunos:', err);
            res.status(500).send('Erro ao buscar alunos.');
            return;
        }
        res.status(200).json(results);
    });
});

// Rota para buscar todos os horários únicos no banco de dados
app.get('/horarios', (req, res) => {
    const query = 'SELECT DISTINCT horario FROM alunos WHERE horario IS NOT NULL';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar horários:', err);
            res.status(500).send('Erro ao buscar horários.');
            return;
        }
        res.status(200).json(results);
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
