
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const JWT_KEY_NAME = "ilovekemserverapi"

class AuthService {
    
    /** hass password method */
    static hassPassword = (password) => {
        return bcrypt.hashSync(password, 10);
    };

    /** compare password method */
    static comparePassWord = (password, hassPass) => {
        return bcrypt.compareSync(password, hassPass);
    }

    /** generate token */
    static generateToken = (data, exp) => {
        let token = jwt.sign(data, JWT_KEY_NAME, {
            algorithm: "HS256",
            expiresIn: exp,
        });
        return {token}
    };

    /** verify token */
    static verifyToken = (token) => {
        try {
            return jwt.verify(token, JWT_KEY_NAME)
        } catch(err) {
            return false;
        }
    }
};


module.exports = AuthService;