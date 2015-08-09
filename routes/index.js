var auth = require('../middlewares/auth');
var sign = require('../controllers/sign');
var site = require('../controllers/site');
var company = require('../controllers/company');
var video = require('../controllers/video');
var user = require('../controllers/user');
var admin = require('../controllers/admin');
var product = require('../controllers/product');
var video = require('../controllers/video');
var order = require('../controllers/order');
var transaction = require('../controllers/transaction');

module.exports = function (app) {
  // 首页
  app.get('/', site.index);
  // 注册
  app.get('/signup', sign.showSignup);
  app.post('/signup', sign.signup);
  // 登录
  app.get('/login', sign.showLogin);
  app.post('/login', sign.login);
  // 退出
  app.get('/logout', sign.logout);
  // 激活账户
  app.get('/active_account', sign.activeAccount);
  // 找回密码
  app.get('/search_pass', sign.showSearchPass);
  app.post('/search_pass', sign.search_pass_auth);
  app.get('/search_pass_auth', sign.showSearchPassAuth);
  app.get('/reset_pass', sign.showResetPass);
  app.post('/reset_pass', sign.resetPass);
  app.get('/search_pass_finish', sign.showSearchPassFinish);

  // 个人页面
  app.get('/user', auth.userRequired, user.showInfo);
  app.get('/changepass', auth.userRequired, user.showChangePass);
  app.post('/updateInfo', auth.userRequired, user.updateInfo);
  app.get('/orders', auth.userRequired, user.showMyOrders);
  app.get('/receiving', auth.userRequired, user.showMyReceiving);
  app.get('/evaluation', auth.userRequired, user.showMyEvaluation);
  app.get('/payment', auth.userRequired, user.showMyPayment);
  app.get('/evaluation/:id', auth.userRequired, user.showReview);
  app.post('/evaluation/:id', auth.userRequired, user.createReview);
  app.get('/logistics/:id', auth.userRequired, user.showLogistics);
  app.get('/returns', auth.userRequired, user.showReturns);
  app.get('/returns/:id', auth.userRequired, user.showReturnDetail);
  app.post('/returns/:id', auth.userRequired, user.updateReturnDetail);

  // 下单流程
  app.get('/mycart', auth.userRequired, order.showMyCart);
  app.get('/myorder', auth.userRequired, order.showMyOrder);
  app.post('/addtocart', order.addToCart);
  app.post('/placeorder', auth.userRequired, order.placeOrder);
  app.get('/submitorder', auth.userRequired, order.submitOrder);
  app.get('/chosepayment/:id', auth.userRequired, order.showChosePayment);
  app.get('/getpdfromcart/:id', auth.userRequired, order.getPdFromCart);
  app.get('/removefromcart/:id', auth.userRequired, order.removeFromCart);
  app.post('/updatepdquantity', auth.userRequired, order.updatePdQuantity);
  //app.get('/cancelorder/:id', auth.userRequired, order.cancelOrder);
  app.post('/cancelorder/:id', auth.userRequired, order.cancelOrderByReason);
  app.get('/submitreceived/:id', auth.userRequired, order.submitReceived);
  app.post('/payment/:id', auth.userRequired, transaction.payment);
  app.get('/paynotify', transaction.paynotify);
  app.get('/payreturn', transaction.payreturn)

  // 收货地址
  app.get('/rmaddress/:id', auth.userRequired, user.destroyAddress);
  app.get('/setdefaultaddress/:id', auth.userRequired, user.setDefaultAddress);
  app.post('/address', auth.userRequired, user.updateAddress);

  // 企业相关
  app.get('/about', company.about);
  app.get('/partner', company.partner);
  app.get('/contact', company.contact);
  app.post('/contact',company.contactMail);
  app.get('/delivery', company.delivery);
  app.get('/refund', company.refund);
  app.get('/warranty', company.warranty);
  app.get('/joinus', company.joinus);
  app.get('/manguide', company.manguide);
  app.get('/womanguide', company.womanguide);
  app.get('/sizedesc', company.sizedesc);

  // 视频
  app.get('/vcategory/:id', video.index);
  app.get('/videos/:id', video.show);
  // 产品
  app.get('/category', product.showCategories);
  app.get('/category/:id', product.showCategory);
  app.get('/product/:id', product.showProduct);
  app.get('/productdetail/:id', product.getProductDetail);
  app.post('/search', product.search);

  // --------------------后台管理---------------------
  app.get('/admin/login', admin.showLogin);
  app.post('/admin/login', admin.login);
  app.get('/partials/:name', auth.adminRequired, admin.getPartials);
  app.get('/admin', auth.adminRequired, admin.index);
  // 后台上传图片
  app.post('/upload', admin.upload);
  // 富文本编辑器中图片部分
  app.get('/uploadImg', admin.editorGetImg);
  app.post('/uploadImg', admin.editorUploadImg);
  // 管理员管理
  app.get('/admin/setting', admin.showAdmins);
  app.get('/admin/setting/:id', admin.showAdmin);
  app.post('/admin/setting', admin.createAdmin);
  app.post('/admin/setting/:id', admin.updateAdmin);
  app.delete('/admin/setting/:id', admin.destoryAdmin);

  // 产品的分类
  app.get('/admin/category', product.categoryindex);
  app.get('/admin/category/:id', product.categoryshow);
  app.post('/admin/category', product.categorycreate);
  app.post('/admin/category/:id', product.categoryupdate);
  app.delete('/admin/category/:id', product.categorydestroy);
  // 产品
  app.get('/admin/category/:cid/product', product.index);
  app.get('/admin/category/:cid/product/:id', product.show);
  app.post('/admin/category/:cid/product', product.create);
  app.post('/admin/category/:cid/product/:id', product.update);
  app.delete('/admin/category/:cid/product/:id', product.destroy);
  // 视频的分类
  app.get('/admin/vcategory', video.vcategoryindex);
  app.get('/admin/vcategory/:id', video.vcategoryshow);
  app.post('/admin/vcategory', video.vcategorycreate);
  app.post('/admin/vcategory/:id', video.vcategoryupdate);
  app.delete('/admin/vcategory/:id', video.vcategorydestroy);
  // 视频
  app.get('/admin/vcategory/:cid/video', video.videoindex);
  app.get('/admin/vcategory/:cid/video/:id', video.videoshow);
  app.post('/admin/vcategory/:cid/video', video.videocreate);
  app.post('/admin/vcategory/:cid/video/:id', video.videoupdate);
  app.delete('/admin/vcategory/:cid/video/:id', video.videodestroy);
  // 企业相关
  app.get('/admin/company', company.companyindex);
  app.get('/admin/company/:name', company.companyshow);
  app.post('/admin/company/:name', company.companyupdate);
  // 订单
  app.get('/admin/order', order.getorders);
  app.get('/admin/orders', order.searchorders);
  app.get('/admin/order/:id', order.getorder);
  app.post('/admin/order/:id', order.updateorder);
};
