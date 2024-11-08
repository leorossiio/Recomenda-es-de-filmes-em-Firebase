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

router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const docRef = doc(db, 'usuarios', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            res.status(200).json(docSnap.data())
        } else {
            res.status(404).json({ message: 'Usuário não encontrado!' })
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'))
        const usuarios = []

        querySnapshot.forEach((doc) => {
            usuarios.push({ id: doc.id, ...doc.data() })
        })

        res.status(200).json(usuarios)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router
