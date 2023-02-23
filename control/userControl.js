/**
 * control/userControl.js
 * Controller da tabela "things" do banco de dados.
 */

// Importa conector do banco de dados.
const conn = require('../model/mysql');

// Objeto "controller" para a entidade "things" do banco de dados.
const userControl = {

    // Lista todos os registros válidos.
    getAll: async (req, res) => {

        try {

            const [rows] = await conn.query("SELECT * FROM users WHERE ustatus = 'on' ORDER BY uname");
            res.json({ data: rows });

        } catch (error) {

            res.json({ status: "error", message: error });

        }

    },

    // Lista um registro único pelo Id.
    getOne: async (req, res) => {

        try {

            const { id } = req.params;
            const [rows] = await conn.query("SELECT * FROM users WHERE uid = ? AND ustatus = 'on'", [id]);
            res.json({ data: rows });

        } catch (error) {

            res.json({ status: "error", message: error });

        }

    },

    // apaga um registro único pelo Id.
    delete: async (req, res) => {

        try {

            const { id } = req.params
            const sql = "UPDATE users SET ustatus = 'del' WHERE uid = ?"
            const [rows] = await conn.query(sql, [id]);
            res.json({ data: rows });

        } catch (error) {

            res.json({ status: "error", message: error });

        }

    },

    // Insere um novo registro.
    post: async (req, res) => {

        let error = [];
        let { name, email, password, avatar, birth } = req.body;

        // Valida name.
        name = String(name);
        console.log(name.lenght);
        if (!name) error.push("Nome é obrigatório.");
        else {
            name = name.trim();
            
            if (name.lenght < 3) error.push("Nome não pode ser vazio.");
        }

        // Valida email.
        email = email.trim();
        if (!email || email == "") error.push("E-mail não pode ser vazio.");
        else if (!/\S+@\S+\.\S+/.test(email)) error.push("E-mail inválido.");

        // Valida password.
        password = password.trim();
        if (!password || password == "") error.push("Senha não pode ser vazia.");
        else if (!/^(?=.*[A-Z])(?=.*[!#@$%&_-])(?=.*[0-9])(?=.*[a-z]).{8,32}$/.test(password)) error.push("Senha inválida.");

        // Valida avatar.

        if (error.length > 0) {
            console.log(error.length, error)
            res.status(400).json({
                status: "error",
                message: error
            });
        } else {



            try {


                const sql = "INSERT INTO users (uname, uemail, upassword, uavatar, ubirth) VALUES (?, ?, SHA1(?), ?, ?)";
                const [rows] = await conn.query(sql, [name, email, password, avatar, birth]);
                res.json({ data: rows });

            } catch (error) {
                res.json({ status: "error", message: error });
            }
        }
    },

    // Edita o registro pelo Id.
    put: async (req, res) => {

        try {

            const { name, email, password, avatar, birth } = req.body;

            // Validação e sanitização dos dados acima antes de "entrgar" ao banco de dados...

            const { id } = req.params;
            const sql = "UPDATE users SET uname = ?, uemail = ?, upassword = SHA1(?), uavatar = ?, ubirth = ? WHERE uid = ?"
            const [rows] = await conn.query(sql, [name, email, password, avatar, birth, id]);
            res.json({ data: rows });

        } catch (error) {

            res.json({ status: "error", message: error });

        }

    }

};

// Exporta o módulo.
module.exports = userControl;

/**
 * By Luferat 2023
 * MIT Licensed
 */