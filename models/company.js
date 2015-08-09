var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
  title: { type: String, unique: true },
  content: { type: Schema.Types.Mixed }
});

mongoose.model('Company', CompanySchema);
