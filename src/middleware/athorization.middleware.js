const { UserModel } = require("../models/user.model");
const AuthService = require("./auth.middleware");


class AuthorMiddlewareChecking {
    /** check token */
    static checkAccessToken = async (req, res, next) => {
        if(!req.headers.accesstoken) {
            return res.status(401).json({errors: 'Access token is missing'})
        }
        const token = req.headers.accesstoken;
        try {
            const deCode = AuthService.verifyToken(token);

            if(!deCode) return res.status(401).json({errors: "token unvalid"})

            const findId = await UserModel.findById(deCode.id);

            if(!findId) return res.status(403).json({errors: "permission denied"});

            next()

        } catch (err) {
            res.status(500).json(err)
        }
    };

    /** isAuthorization */
    static isAuthorization = async (req, res, next) => {
        if(!req.headers.authorization) {
            return res.status(401).json({errors: "Missing authorization token in headers"})
        }
        const token = req.headers.authorization.split(' ')[1]
        try {
            const deCode = AuthService.verifyToken(token);
            const findById = await UserModel.findById(deCode.id);
            if(!findById) res.status(403).json({errors: "permission denied"});
            res.id = findById._id
            next();
        } catch (err) {
            res.status(500).json(err);
        }
    };

    /** check supper admin */
    static isSupperAdmin = async (req, res, next) => {
        if(!req.headers.authorization) return res.status(401).json({errors: "Missing authorization token"});
        const token = req.headers.authorization.split(' ')[1];
        try {

            const deCode = await AuthService.verifyToken(token);

            if(!deCode) return res.status(403).json({errors: "permission dinied"});

            const findById = await UserModel.findById(deCode.id).populate('userType');
            if(!findById) return res.status(403).json({errors: "forbidden errors"});

            if(findById.userType.role !== 1) return res.status(403).json({errors})
            next()

        } catch(err) {
            res.status(500).json(err)
        }
    }
}

module.exports = AuthorMiddlewareChecking;