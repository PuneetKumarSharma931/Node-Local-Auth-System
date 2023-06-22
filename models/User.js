const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: function(value) {

            if(!validator.isEmail(value)) {

                throw new Error(`${value} is not a valid email address!`)
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: [3, "The password should be atleast 3 characters long"],
        max: [16, "Password cannot exceed 16 characters!"]
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {

    try {
        
        this.password = await bcrypt.hash(this.password, 12);

        next();

    } catch (error) {
        
        console.log(error);

        throw new Error("Some internal server error occured!");
    }
});

const User = new mongoose.model('User', UserSchema);

module.exports = User;