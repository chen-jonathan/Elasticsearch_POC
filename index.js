const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const express = require('express');
//instantiate app
const app = express();
const path = require('path');

//Configure app
app.use(express.json());
app.set('port', process.env.PORT || 3001);
app.use( express.static( path.join( __dirname, 'public' )));
// enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Define Routes in web application
app.get('/', function(request, response) {
    response.sendFile('template.html', {
        root: path.join(__dirname, 'views')
    });
})

app.get('/search', function(request, response) {
    //query object
    let body = {
        query: {
            match: {
                name: request.query['q']
            }
        }
    }
    //perform query
    client.search({
        index: 'scotch.io-tutorial',
        body: body
    }).then(results => {
        response.send(results.body.hits.hits); 
    }).catch(error => {
        console.log(error)
        response.send([])
    });
})

// Second route for client side Elasticsearch queries
app.get('/v2', function(request, response){
    response.sendFile('template2.html', {
       root: path.join( __dirname, 'views' )
     });
  })

app.listen(app.get('port'), function() {
    console.log("Express server listening on port "+ app.get('port'));
})