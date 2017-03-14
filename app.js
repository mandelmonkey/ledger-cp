var express = require('express');
var app = express();
app.use(express.static(_direname + '/app'));
app.listen(process.env.PORT || 3000);