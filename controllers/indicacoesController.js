const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const app = require('../database/db');
const express = require('express');

const db = getFirestore(app);
const router = express.Router();

// Rota para obter recomendações de filmes com base nos gêneros e idade do usuário
router.get('/recomendar/:idUsuario', async (req, res) => {
    const { idUsuario } = req.params;

    try {
        // Buscando o usuário para obter seus gêneros favoritos e idade
        const usuarioRef = doc(db, 'usuarios', idUsuario);
        const usuarioSnap = await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const usuarioData = usuarioSnap.data();
        const { genero: generosFavoritos, idade } = usuarioData;

        // Consultando todos os filmes na coleção
        const filmesRef = collection(db, 'filmes');
        const filmesSnapshot = await getDocs(filmesRef);

        const indicacoes = {};
        
        // Filtrando filmes por gêneros favoritos e classificação indicativa
        filmesSnapshot.forEach((doc) => {
            const filme = doc.data();

            // Verifica se o gênero do filme está nos favoritos e se a idade é suficiente para a classificação indicativa
            const podeAssistir = 
                filme.classificacao === 'L' ||  // "L" significa livre
                idade >= filme.classificacao;

            if (generosFavoritos.includes(filme.genero) && podeAssistir) {
                if (!indicacoes[filme.genero]) {
                    indicacoes[filme.genero] = [];
                }
                indicacoes[filme.genero].push(filme.titulo);
            }
        });

        res.status(200).json({ indicacoes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
