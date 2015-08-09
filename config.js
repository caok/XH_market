var config = {
  name: 'FITTERGEAR',
  host: '127.0.0.1:3000',
  port: 3000,

  db: 'mongodb://127.0.0.1/xhmarket',
  db_name: 'FITTERGEAR',
  session_secret: 'fittergear',
  cookie_secret: 'fittergear',

  mail_opts: {
    host: 'smtp.163.com',
    port: 25,
    auth: {
      user: 'xxx@163.com',
      pass: 'password'
    }
  },
  contactEmail:"xxx@163.com"
};

module.exports = config;
