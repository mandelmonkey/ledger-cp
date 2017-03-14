var path = require('path');
var express = require('express');
var app = express();
 
app.set('port', (process.env.PORT || 5000));
 
app.use('/lib', express.static(__dirname + '/lib'));
app.use(express.static(path.join(__dirname, 'dist')));
 

 // If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  }
}

// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});


// redireciona todas as requições para o Angular 2 
app.all('*', function(req, res) {
  res.status(200).sendFile(
  	path.join(__dirname, 'dist', 'index.html'));
});
 
app.listen(app.get('port'), function() {
  console.log('Node executando na porta ', app.get('port'));
});

