var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VcategorySchema = new Schema({
  name: { type: Schema.Types.Mixed }
});

mongoose.model('Vcategory', VcategorySchema);
