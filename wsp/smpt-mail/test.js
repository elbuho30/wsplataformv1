const email  = require(".");
const assert = require("assert");

const config = {
  smtpHost: 'smtp.exmail.qq.com',
  smtpUser: 'shiqiang.tang@jiukangyun.com',
  smtpPass: process.env.NODE_SMTP_PASS,
  from: 'shiqiang.tang@jiukangyun.com',
  to: ['i@tsq.me'],
  subject: 'hello world',
  htmlStr: '<p>hello <a href="https://github.com"><%=user.name%></a></p>',
  htmlContext: {
    user: {
      name: 'tsq'
    }
  }
};

email(config, (err, result) => {
  assert.ok(!err);
  assert.ok(result.envelope.from === config.from);
});