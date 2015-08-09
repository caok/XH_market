var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comments = new Schema({
  userName: String,
  orderId: { type: Schema.Types.ObjectId },
  title: String,
  content: String,
  usabilityPoint: { type: Number, default: 0 },
  effectivePoint: { type: Number, default: 0 },
  quantityPoint: { type: Number, default: 0 },
  attitudePoint: { type: Number, default: 0 },
  happenedAt: { type: Date, default: Date.now }
});

var ProductSchema = new Schema({
  name: { type: Schema.Types.Mixed },
  price: { type: Number, min: 0 },
  quantity: { type: Number, min: 0, default: 0 },
  // 售出数量
  selled: { type: Number, min: 0, default: 0 },
  images: { type: Array },
  coverIndex: { type: Number, min: 0, default: 0 },
  description: { type: Schema.Types.Mixed },
  intro: { type: Schema.Types.Mixed },
  categoryId: { type: Schema.Types.ObjectId },
  /*
   * 0：可购买
   * 1：不可购买
   * */
  state: { type: Number, min: 0, max: 1, default: 0 },
  comments: [Comments]
});

mongoose.model('Product', ProductSchema);
