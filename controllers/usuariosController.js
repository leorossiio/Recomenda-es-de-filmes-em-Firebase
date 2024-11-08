const { getFirestore, collection, addDoc } = require('firebase/firestore');
const app = require('../database/db'); // Importa o arquivo de configuração do Firebase

const db = getFirestore(app); // Obtém a instância do Firestore

// Função para cadastrar um usuário
exports.cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body; // Dados do usuário

    try {
        // Cria um novo documento na coleção 'usuarios' no Firestore
        const docRef = await addDoc(collection(db, 'usuarios'), {
            nome,
            email,
            senha // Lembre-se de que salvar a senha em texto simples não é recomendado para produção
        });

        // Retorna a resposta com sucesso e o ID do usuário cadastrado
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuarioId: docRef.id });
    } catch (error) {
        // Retorna erro caso algum problema ocorra durante o cadastro
        res.status(400).json({ error: error.message });
    }
};