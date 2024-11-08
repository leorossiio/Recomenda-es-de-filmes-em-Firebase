require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usuariosController = require('./controllers/usuariosController');
const filmesController = require('./controllers/filmesController');
const indicacoesController = require('./controllers/indicacoesController');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/usuarios', usuariosController);
app.use('/filmes', filmesController)
app.use('/indicacoes', indicacoesController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
