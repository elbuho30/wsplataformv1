# smpt-mail
[![build status][travis-image]][travis-url]
[travis-image]: https://travis-ci.org/tsq-happy/smpt-mail.svg?branch=master
[travis-url]: https://travis-ci.org/tsq-happy/smpt-mail

Send email use smpt transport and support ejs render html 
  
## Install

```
npm install smpt-mail
```

## Usage

```javascript
const email  = require("smpt-mail");

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
   console.log(err, result);
});
```

## Config


param|type|description
----|----|---|----
smtpHost | string | your smtp server host
smtpUser | string | your smtp server email address
smtpPass | string | your smtp server email password
from | string | the e-mail address of the sender
to | array | comma separated list or an array of recipients e-mail addresses
cc | array | comma separated list or an array of recipients e-mail addresses
subject | string | email subject
htmlStr | string | email content string that will be rendered by ejs
htmlContext | object | ejs render context



