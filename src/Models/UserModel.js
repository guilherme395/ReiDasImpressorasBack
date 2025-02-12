const conn = require("./Conn/Database.js");

class UserModel {
    async create({ name, email, password }) {
        const [user] = await conn("users")
            .insert({ name, email, password });
        return user;
    }

    async findByEmail(email) {
        const [user] = await conn("users")
            .select("*")
            .where({ email });
        return user;
    }
}

module.exports = new UserModel();