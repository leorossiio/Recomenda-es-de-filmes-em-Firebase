const { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, getDoc, getDocs } = require('firebase/firestore');
const app = require('../database/db'); 
const express = require('express'); 

const db = getFirestore(app);
const router = express.Router();

// Cadastrar filme (POST)
router.post('/', async (req, res) => { 
    const { titulo, avaliacao, genero } = req.body;
    try {
        const docRef = await addDoc(collection(db, 'filmes'), {
            titulo,
            avaliacao,
            genero
        });
        res.status(201).json({ message: 'Filme cadastrado com sucesso!', filmeId: docRef.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Deletar filme (DELETE)
router.delete('/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        await deleteDoc(doc(db, 'filmes', id));
        res.status(200).json({ message: 'Filme deletado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Atualizar filme (PATCH)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, avaliacao, genero } = req.body; 
    try {
        const filmeRef = doc(db, 'filmes', id); 
        await updateDoc(filmeRef, {
            titulo: titulo || undefined, 
            avaliacao: avaliacao || undefined,
            genero: genero || undefined
        });
        res.status(200).json({ message: 'Filme atualizado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obter um filme (GET by ID)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const docRef = doc(db, 'filmes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            res.status(200).json(docSnap.data());
        } else {
            res.status(404).json({ message: 'Filme não encontrado!' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obter todos os filmes (GET)
router.get('/', async (req, res) => { 
    try {
        const querySnapshot = await getDocs(collection(db, 'filmes'));
        const filmes = [];
        querySnapshot.forEach((doc) => {
            filmes.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(filmes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;