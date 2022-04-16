const bcrypt = require('bcrypt');
const app = require('../app');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signUp = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
        user.save()
            .then(() => res.status(201).json({message: 'User créé!'}))
            .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}))
};

exports.logIn = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
            return res.status(401).json({message: 'User non trouvé!'})
            };
            bcrypt.compare(req.body.password, hash)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({message: 'Mot de passe incorrect'})
                    };
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}))
};