// Import mongoose to define the data schema
const mongoose = require('mongoose')

/* User Schema definition
   Here we define the fields for each user in the database
   According to requirements: id is a Number, names are Strings, and birthday is a Date
*/
const userSchema = new mongoose.Schema({
    id: { 
        type: Number,
        required: true,
        unique: true 
    },
    first_name: { 
        type: String,
        required: true 
    },
    last_name: { 
        type: String,
        required: true 
    },
    birthday: { 
        type: Date,
        required: true 
    }
})

/* Create the model from the schema
   The third parameter 'users' sets the collection name in MongoDB as required
*/
const User = mongoose.model('User', userSchema, 'users')

// Export the model
module.exports = User