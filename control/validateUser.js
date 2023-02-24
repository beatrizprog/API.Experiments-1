/**
 * control/validateUsers.js
 * Faz a validação dos campos do usuário.
 */

// Inicializa variáveis.
user = {}
err = []

// Valida campos do usuário.
validateUser = {
    validate: (userData) => {

        // Remove espaços antes e depois da string e esvazia campos preenchidos só com espaços.
        for (const key in userData) user[key] = userData[key].trim();

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

    }
}

module.exports = validateUser

/**
 * By Luferat 2023
 * MIT Licensed
 */