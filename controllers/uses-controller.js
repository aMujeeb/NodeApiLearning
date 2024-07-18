const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

  const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

//Use express validator for validations. 3rd party libraries npm install --save express-validator

const DUMMY_USERS = [
    {
        id: 'u1',
        name : 'Mujee',
        email : 'abc@g.com',
        password : 'test'
    }
];

const getUsers = (req, res, next) => {
    res.status(200).json({ users : DUMMY_USERS });
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError('Validation errors', 422)
        );
    }
    
    const { name, email, password } = req.body;

    //Verify is Email already have
    const hasUser = DUMMY_USERS.find(u => u.email === email);

    if(hasUser) {
        return next(
            new HttpError('User Already Exists', 422)
        );
    }

    const createdUser = {
        id: uuidv1(),
        name: name,
        email: email,
        password: password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password) {
        return next(
            new HttpError('Could Not identify user, Credentials seems to be wrong', 401)
        );
    }
     res.json({ message: 'Logged in!'});
};

//pointing functions as values
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;