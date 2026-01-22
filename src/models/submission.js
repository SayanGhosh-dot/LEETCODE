const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userid: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemid: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'cpp', 'java'] 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  // milliseconds
    default: 0
  },
  memory: {
    type: Number,  // kB
    default: 0
  },
  errormessage: {
    type: String,
    default: ''
  },
  testcasespassed: {
    type: Number,
    default: 0
  },
  testcasestotal: {  // Recommended addition
    type: Number,
    default: 0
  }
}, { 
  timestamps: true
});
submissionSchema.index({userid:1,problemid:1});//create compound index
const submissions=mongoose.model("submission",submissionSchema);
module.exports=submissions;