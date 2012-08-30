/** tengwarjs server
 *
 * @author G. Hussain Chinoy
 * @version 1.0.0
 * @date 08/29/2012
 * @ref Kris Kowal's tengwarjs
 * @ref https://github.com/kriskowal/tengwarjs
 */

var restify = require('restify'),
 	http = require('http'),
 	tengwarjs = require('tengwar');
 	//Logger = require('bunyan');

/* Logging
 */
/*
var log = new Logger( {
	name: 'tengwarjs-restify',
	streams: [{stream: process.stdout, level: 'debug'}, {path: 'tengwarjs-restify-server.log', level: 'trace'}],
	serializers: { req: Logger.stdSerializers.req, res: restify.bunyan.serializers.response }
});
*/

/*  basic static info
 */
var SERVER_TITLE = "nodejs server for tengwarjs";
var CURRENT_VERSION = '1.0.0';
var ROUTE = '/api/';

 /* Simple HTML response
  */
function ShowTitle(req, res, next) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<html><head><body>' + SERVER_TITLE + ' version ' + CURRENT_VERSION);
	res.write('<p>Usage</p>');
	res.write('GET <code>/api/transcribe/</code><em>text_to_transcribe</em><br /><br />');
	res.write('GET <code>/api/transcribe/?input=</code><em>text_to_transcribe</em><br /><br />');
	res.write('POST <code>/api/transcribe/</code> <br />Content-Type: application/x-www-form-urlencoded<br />input=<em>text_to_transcribe</em><br />');
	res.write('</body></html>');
	res.end();
	//res.send(server_title + " version: " + current_version);
	return next();
}

function Transcribe(req, res, next) {

	var input = req.params.input;
	
	if (req.params.input != null) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(tengwarjs.transcribe(input));
		res.end();
	} else {
		res.contentType = 'application/json';
		res.send({error: 204, message: 'no content'});
	}
	
	return next();

}

function TestTranscribe(req, res, next) {
	var ring = "Ash nazg durbatulûk, ash nazg gimbatul, Ash nazg thrakatulûk agh burzum-ishi krimpatul.";

	console.log(tengwarjs.transcribe(ring));
}


/* Define the nodejs restify server and routes
 */
var server = restify.createServer(
	{ name: SERVER_TITLE, path: ROUTE, version: CURRENT_VERSION},
	ShowTitle );

server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser()); // enable bundled plug in for POST body parsing
server.use(restify.queryParser());

server.get('/api', ShowTitle);
server.get('/api/transcribe/:input', Transcribe);
server.get('/api/transcribe/', Transcribe);
server.post('/api/transcribe/', Transcribe);
server.get('/api/test', TestTranscribe);

server.listen(8095, function() {
	console.log('%s listening at %s', server.name, server.url);
});