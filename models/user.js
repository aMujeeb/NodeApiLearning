const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : { type: String, required: true },
    email : { type: String, required: true, unique: true }, //Unique created an internal index for query purposses for mongo internal uses
    password : { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }] //to assign mongo created ObjectID & refere the related schema
});

userSchema.plugin(uniqueValidator); //Validate queries database

module.exports = mongoose.model('User', userSchema);