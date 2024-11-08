const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const app = require('../firebaseConfig');

const auth = getAuth(app);

exports.cadastrarUsuario = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: userCredential.user.uid });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
