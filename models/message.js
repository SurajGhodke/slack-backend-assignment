const mongoose = require('mongoose');

const Message = mongoose.model('Message',{ name : String, message : String})
