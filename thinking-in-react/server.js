var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env['PORT'] || 3000));

app.use('/', express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/:filename', function(req, res) {
    fs.readFile(req.params.filename, function(error, data) {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

app.post('/:filename', function(req, res) {
    fs.readFile(req.params.filename, function(error, data) {
        var comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile(req.params.filename, JSON.stringify(comments, null, 4), function(error) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');
            res.send(JSON.stringify(comments));
        });
    });
});

app.listen(app.get('port'), function() {
    console.log('server started at http://localhost:' + app.get('port') + '/');
});