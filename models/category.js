var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: { type: String, unique: true },
  enName: { type: String },
  imgUrl: { type: String }
});

CategorySchema.index({name: 1}, {unique: true});

mongoose.model('Category', CategorySchema);
