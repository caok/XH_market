var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VideoSchema = new Schema({
  name: { type: Schema.Types.Mixed },
  url: { type: String },
  vcategoryId: { type: Schema.Types.ObjectId },
  happenedAt: { type: Date, default: Date.now },
});

mongoose.model('Video', VideoSchema);
