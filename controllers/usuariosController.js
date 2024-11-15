const { Router } = require('express')
const { getFirestore, collection, addDoc, deleteDoc, doc, getDocs, getDoc, updateDoc } = require('firebase/firestore')
const app = require('../database/db')

const db = getFirestore(app)
const router = Router()

router.post('/', async (req, res) => {
    const { nome, email, genero, idade } = req.body

    try {
        const generos = Array.isArray(genero) ? genero : [genero]
        const docRef = await addDoc(collection(db, 'usuarios'), {
            nome,
            email,
            genero: generos,
            idade
        })

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuarioId: docRef.id })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        await deleteDoc(doc(db, 'usuarios', id))
        res.status(200).json({ message: 'Usuário deletado com sucesso!' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    const { id } = req.params
    const { nome, email, genero, idade } = req.body

    try {
        const usuarioRef = doc(db, 'usuarios', id)

        const updates = {};
        if (nome) updates.nome = nome
        if (email) updates.email = email
        if (genero) updates.genero = genero
        if (idade) updates.idade = idade

        await updateDoc(usuarioRef, updates)

        res.status(200).json({ message: 'Usuário atualizado com sucesso!' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Listar por id (GET)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const docRef = doc(db, 'usuarios', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            res.status(200).json(userData);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todos (GET)
router.get('/', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'))
        const usuarios = []

        querySnapshot.forEach((doc) => {
            usuarios.push({ id: doc.id, ...doc.data() })
        })

        res.status(200).json({ quantidade: usuarios.length + " usuário(s)", usuarios });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Filtro por nome (GET)
router.get('/nome/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        const usuarios = [];

        querySnapshot.forEach((doc) => {
            const usuario = { id: doc.id, ...doc.data() };
            if (usuario.nome.toLowerCase().includes(nome.toLowerCase())) {
                usuarios.push(usuario);
            }
        });
        res.status(200).json({ quantidade: usuarios.length + " usuário(s)", usuarios });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Filtro por idade (GET)
router.get('/idade/:idade', async (req, res) => {
    const { idade } = req.params;
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        const usuarios = [];

        querySnapshot.forEach((doc) => {
            const usuario = { id: doc.id, ...doc.data() };
            if (usuario.idade === parseInt(idade)) {
                usuarios.push(usuario);
            }
        });
        res.status(200).json({ quantidade: usuarios.length + " usuário(s)", usuarios });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router