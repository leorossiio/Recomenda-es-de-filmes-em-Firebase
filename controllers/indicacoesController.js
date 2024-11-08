const { getFirestore, collection, addDoc } = require('firebase/firestore');

const app = require('../database/db');
const express = require('express');

const db = getFirestore(app);
const router = express.Router();

exports.recomendarFilmes = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        // Obter as preferências do usuário
        const usuarioQuery = query(collection(db, 'usuarios'), where('id', '==', usuarioId));
        const usuarioSnapshot = await getDocs(usuarioQuery);

        if (usuarioSnapshot.empty) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const usuarioData = usuarioSnapshot.docs[0].data();
        const preferencias = usuarioData.preferencias;
        const idade = usuarioData.idade;

        if (!preferencias || preferencias.length === 0) {
            return res.status(404).json({ message: 'Nenhuma preferência encontrada para este usuário.' });
        }

        // Definir a classificação indicativa máxima com base na idade do usuário
        let classificacaoMaxima;
        if (idade >= 18) {
            classificacaoMaxima = 18;
        } else if (idade >= 16) {
            classificacaoMaxima = 16;
        } else if (idade >= 14) {
            classificacaoMaxima = 14;
        } else if (idade >= 12) {
            classificacaoMaxima = 12;
        } else if (idade >= 10) {
            classificacaoMaxima = 10;
        } else {
            classificacaoMaxima = 0; // Para idades menores que 10
        }

        // Obter todos os filmes
        const filmesSnapshot = await getDocs(collection(db, 'filmes'));

        const recomendacoes = [];
        filmesSnapshot.forEach(doc => {
            const filmeData = doc.data();
            // Verificar se o gênero do filme está nas preferências do usuário e se a classificação indicativa é adequada
            if (preferencias.includes(filmeData.genero) && filmeData.classificacaoIndicativa <= classificacaoMaxima) {
                recomendacoes.push(filmeData);
            }
        });

        res.status(200).json(recomendacoes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};