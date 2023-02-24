/**
 * control/userControl.js
 * Controller da tabela "things" do banco de dados.
 */

// Importa conector do banco de dados.
const conn = require('../model/mysql');

// Obtém configurações do aplicativo (verifique a atualização de /.env).
const conf = require('dotenv').config().parsed;

// Importa Validator -> https://github.com/validatorjs/validator.js.
var validator = require('validator');

// Importa ferramentas do aplicativo -> /control/apptools.js
var appTools = require('./apptools');

// Inicializa variáveis.
user = {}
err = []

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

        // Remove espaços antes e depois da string e esvazia campos preenchidos só com espaços.
        for (const key in req.body) user[key] = req.body[key].trim();

        // Valida nome com pelo menos 3 caracteres.
        if (validator.isEmpty(user.name)) err.push('O nome é obrigatório.')
        else if (!validator.isLength(user.name, 3)) err.push('O nome está muito curto.')

        // Valida e-mail.
        if (validator.isEmpty(user.email)) err.push('O e-mail é obrigatório.')
        else if (!validator.isEmail(user.email)) err.push('O e-mail é inválido.')

        // Valida senha. Regras: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }
        if (validator.isEmpty(user.password)) err.push('A senha é obrigatória.')
        else if (!validator.isStrongPassword(user.password)) err.push('A senha está muito fraca.')

        // O avatar é opcional e, caso não exista, usa um avatar padrão.
        if (validator.isEmpty(user.avatar)) user.avatar = conf.DEFAULT_AVATAR

        // Valida data de aniversário e aceita somente maiores de 14 anos.
        if (validator.isEmpty(user.birth)) err.push('Data de nascimento é obrigatória.')
        else if (!validator.isDate(user.birth)) err.push('Data de nascimento inválida.')
        else if (appTools.getAge(user.birth) < 14) err.push('Você deve ter 14 anos ou mais.')

        // Se ocorreram erros...
        if (err.length > 0) {
            res.json({ status: "error", message: err })
        } else {
            try {
                const sql = "INSERT INTO users (uname, uemail, upassword, uavatar, ubirth) VALUES (?, ?, SHA1(?), ?, ?)";
                const [rows] = await conn.query(sql, [user.name, user.email, user.password, user.avatar, user.birth]);
                res.json({ status: "success", data: rows });
            } catch (error) {
                res.json({ status: "error", message: error });
            }
        }

    },

    // Edita o registro pelo Id.
    put: async (req, res) => {

        // Remove espaços antes e depois da string e esvazia campos preenchidos só com espaços.
        for (const key in req.body) user[key] = req.body[key].trim();

        // Valida nome com pelo menos 3 caracteres.
        if (validator.isEmpty(user.name)) err.push('O nome é obrigatório.')
        else if (!validator.isLength(user.name, 3)) err.push('O nome está muito curto.')

        // Valida e-mail.
        if (validator.isEmpty(user.email)) err.push('O e-mail é obrigatório.')
        else if (!validator.isEmail(user.email)) err.push('O e-mail é inválido.')

        // Valida senha. Regras: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }
        if (validator.isEmpty(user.password)) err.push('A senha é obrigatória.')
        else if (!validator.isStrongPassword(user.password)) err.push('A senha está muito fraca.')

        // O avatar é opcional e, caso não exista, usa um avatar padrão.
        if (validator.isEmpty(user.avatar)) user.avatar = conf.DEFAULT_AVATAR

        // Valida data de aniversário e aceita somente maiores de 14 anos.
        if (validator.isEmpty(user.birth)) err.push('Data de nascimento é obrigatória.')
        else if (!validator.isDate(user.birth)) err.push('Data de nascimento inválida.')
        else if (appTools.getAge(user.birth) < 14) err.push('Você deve ter 14 anos ou mais.')

        // Se ocorreram erros...
        if (err.length > 0) {
            res.json({ status: "error", message: err })
        } else {

            try {
                const { id } = req.params;
                const sql = "UPDATE users SET uname = ?, uemail = ?, upassword = SHA1(?), uavatar = ?, ubirth = ? WHERE uid = ?"
                const [rows] = await conn.query(sql, [user.name, user.email, user.password, user.avatar, user.birth, id]);
                res.json({ data: rows });
            } catch (error) {
                res.json({ status: "error", message: error });
            }
        }
    }

};

// Exporta o módulo.
module.exports = userControl;

/**
 * By Luferat 2023
 * MIT Licensed
 */