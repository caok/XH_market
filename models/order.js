//var mongoose = require('mongoose');
var mongoose = require('mongoose-paginate');
var Schema = mongoose.Schema;

var Products = new Schema({
  productId: { type: Schema.Types.ObjectId },
  name: { type: Schema.Types.Mixed },
  coverUrl: { type: String },
  price: { type: Number, min: 0 },
  quantity: { type: Number, min: 0, default: 0 },
});

var OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  userName: { type: String },
  products: [Products],
  // 总金额
  pay: { type: Number, min: 0 },
  // 运费
  freight: { type: Number, min: 0 },
  /*
   * 付款方式
   * 0：货到付款
   * 1：即时支付
   * */
  payment: { type: Number, min: 0, max: 1, default: 0 },
  happenedAt: { type: Date, default: Date.now },
  paymentTime: { type: Date },
  deliveryTime: { type: Date },
  receivedTime: { type: Date },
  address: { type: Schema.Types.Mixed },
  logisticsInfo: { type: Schema.Types.Mixed },
  closeReason: { type: String },
  returnReason: { type: String },
  /*
   * 状态
   * 0：未付款
   * 1：已付款，未发货
   * 2：已发货，未收货
   * 3：已收货，未评价
   * 4：已评价
   * 5：正在退货
   * 6：退货成功
   * 7：关闭
   */
  state: { type: Number, min: 0, max: 7, default: 0 },
  // 支付宝交易号
  trade_no: { type: String },
  // 支付的支付宝帐号
  buyer_email: { type: String },
  /*
   * 付款状态
   * 0: 还未付款
   * 1: 正在付款中
   * */
  paying: { type: Number, min: 0, max: 1, default: 0 }
});

mongoose.model('Order', OrderSchema);
