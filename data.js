//require the Elasticsearch librray
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

//Create a new index called 'scotch.io-tutorial' (Step 3)
client.indices.create({
        index: 'scotch.io-tutorial'
    }, function(error, response, status) {
        if (error) {
            console.log(error.message);
        }
        else {
            console.log("create a new index", response);
        }
    }
);

//Create a document in the 'scotch.io-tutorial' index (Step 4, Part 1)
client.index({
    index: 'scotch.io-tutorial',
    id : '1',
    body :{
        "Key1": "Content for key1",
        "Key2": "Content for key2",
        "Key3": "Content for key3"
    }
}, function(error, response, status) {
    console.log(response);
});

//Step 4 Part 2
const cities = require('./cities.json');
var bulk = [];
cities.forEach(city => {
    bulk.push({index: {
        _index: 'scotch.io-tutorial'
        }
    })
    bulk.push(city)
})

//perform bulk indexing of data with bulk API
client.bulk({body: bulk}, function(error, response) {
    if (error) {
        console.log("Failed Bulk operation", error);
    }
    else {
        console.log("Successfully imported %s", cities.length);
    }
})


