// Import mongoose to define the cost schema
const mongoose = require('mongoose')

/* Cost Schema definition
   Includes description, category, userid, and sum
   As required, categories are limited to specific values
*/
const costSchema = new mongoose.Schema({
    userid: { 
        type: Number,
        required: true 
    },
    description: { 
        type: String,
        required: true 
    },
    category: { 
        type: String,
        required: true,
        // The project allows only these categories
        enum: ['food', 'health', 'housing', 'sports', 'education']
    },
    sum: { 
        type: Number,
        required: true 
    },
    // The server will use the current date if no date is provided
    createdAt: { 
        type: Date,
        default: Date.now 
    }
})

// Create the model and set the collection name to 'costs'
const Cost = mongoose.model('Cost', costSchema, 'costs')

// Export the model
module.exports = Cost