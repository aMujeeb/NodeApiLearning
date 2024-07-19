const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');

//Use express validator for validations. 3rd party libraries npm install --save express-validator

const DUMMY_USERS = [
    {
        id: 'u1',
        name : 'Mujee',
        email : 'abc@g.com',
        password : 'test'
    }
];

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({ }, '-password'); //'-password' will return results objects without the password attribute
    } catch(err) {
        return next(
            new HttpError('Returning Users failure', 500)
        );
    }

    res.status(200).json({ users :  users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError('Validation errors', 422)
        );
    }
    
    const { name, email, password, places } = req.body;

    //Verify is Email already have
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        return next(
            new HttpError('Sign up failure', 500)
        );
    }

    if(existingUser) {
        return next(
            new HttpError('User exist.', 422)
        );
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
        password,
        places: []
    });

    //DUMMY_USERS.push(createdUser);
    try {
        await createdUser.save();
    } catch (err) {
        return next(
            new HttpError('Sign up failed..', 500)
        );
    }

    res.status(201).json({ user: createdUser.toObject( { getters: true} ) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    //const identifiedUser = DUMMY_USERS.find(u => u.email === email);

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        return next(
            new HttpError('Login In failed.', 500)
        );
    }

    if(!existingUser || existingUser.password !== password) {
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