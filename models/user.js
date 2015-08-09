var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Address = new Schema({
  receiver: String,
  street: String,
  tel: String,
  postcode: String
});

var Consults = new Schema({
  speaker: String,
  content: String,
  happenedAt: { type: Date, default: Date.now }
});

var Cart = new Schema({
  productId: { type: Schema.Types.ObjectId },
  quantity: { type: Number, min: 0, default: 0 }
});

var UserSchema = new Schema({
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  point: { type: Number, default: 0 },
  curAddress: { type: String },
  addresses: [Address],
  consults: [Consults],
  cart: [Cart],
  /*
   * 0：已注册未激活
   * 1：已激活
   * */
  state: { type: Number, min: 0, max: 1, default: 0 },
  retrieveKey: String,
  retrieveTime: Number,
  rememberKey: String,
});

UserSchema.index({name: 1});
UserSchema.index({email: 1}, {unique: true});

UserSchema.virtual('active').get(function () {
  if (this.state == 1) {
    return true;
  } else {
    return false;
  };
});

mongoose.model('User', UserSchema);
