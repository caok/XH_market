var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new Schema({
  name: { type: String, unique: true },
  password: { type: String },
});

AdminSchema.index({name: 1});

mongoose.model('Admin', AdminSchema);
