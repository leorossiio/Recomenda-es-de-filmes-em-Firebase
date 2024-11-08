const { getFirestore, collection, addDoc } = require('firebase/firestore');
const app = require('../database/db');

const db = getFirestore(app);

exports.indicarFilme = async (req, res) => {
    const { usuarioId, filmeId, comentario } = req.body;
    try {
        const docRef = await addDoc(collection(db, 'indicacoes'), {
            usuarioId,
            filmeId,
            comentario,
            dataIndicacao: new Date()
        });
        res.status(201).json({ message: 'Indicação registrada com sucesso!', indicacaoId: docRef.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
