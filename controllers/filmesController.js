const { getFirestore, collection, addDoc } = require('firebase/firestore');
const app = require('../database/db');

const db = getFirestore(app);

exports.cadastrarFilme = async (req, res) => {
    const { titulo, descricao, genero } = req.body;
    try {
        const docRef = await addDoc(collection(db, 'filmes'), {
            titulo,
            descricao,
            genero
        });
        res.status(201).json({ message: 'Filme cadastrado com sucesso!', filmeId: docRef.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
