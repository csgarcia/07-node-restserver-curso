const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = ({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Category is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Category", categorySchema);