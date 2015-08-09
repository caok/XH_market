var language = require('./langs').language;

exports.setLang = function (req, res, next) {
  var local = req.cookies.language;
  if (local && local === 'en') {
    res.locals.local = 'en';
  } else {
    res.locals.local = 'zh';
  };
  res.locals.language = language;
  next();
}
