const config = require('./config'),
    restify = require('restify'),
    mysql = require('mysql')


var connection = config.db.get;

/**
 * habilitando cors. para poder acessar através de um cliente no mesmo dominio
 */
var corsMiddleware = require('restify-cors-middleware');

var cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*']
});

/**
 * Initialize Server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version,
    url: config.hostname
});

//ainda habilitando cors
server.pre(cors.preflight);
server.use(cors.actual);

/**
 * habilitando parser json para receber corretamente os valores json vindos da requisição, post e put
 */
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));
server.use(restify.plugins.acceptParser(server.acceptable));



server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url);
});


//rest api to get all results
server.get('/employees', function (req, res) {
    connection.query('select * from employee', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to get a single employee data
server.get('/employees/:id', function (req, res) {
    connection.query('select * from employee where id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to create a new record into mysql database
server.post('/employees', function (req, res) {
    var postData = req.body;
    connection.query('INSERT INTO employee SET ?', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to update record into mysql database
server.put('/employees', function (req, res) {

    console.log(req.body);

    connection.query('UPDATE `employee` SET `employee_name`=?,`employee_salary`=?,`employee_age`=? where `id`=?',
        [req.body.employee_name, req.body.employee_salary, req.body.employee_age, req.body.id], function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
});

//rest api to delete record from mysql database
server.del('/employees/:id', function (req, res) {
    connection.query('DELETE FROM `employee` WHERE `id`=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.end('Record has been deleted!');
    });
});

server.get('/', function (req, res) {
    console.log('Welcome Nodejs restify');
});