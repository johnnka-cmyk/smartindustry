//MQTT-välityspalvelimen määrittely
const mqtt   = require('mqtt');
const broker = 'mqtt://test.mosquitto.org';
const user   = '';
const pw     = '';

//Määritellään välityspalvelimen "olio"
const mq = mqtt.connect(broker, {
    'username': user,
    'password': pw
});

//tilataan oikea topic
mq.subscribe('automaatio1');

//liitytään välityspalvelimeen
mq.on('connect', function () {
    console.log('Connected.....');
});

//Määritellään tietokanta-API
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://john:john@cluster0.xqqrmo3.mongodb.net/?appName=Cluster0'; // korvaa tämä omalla URI:lla
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
strict: true,
        deprecationErrors: true,
    },
});

//Määritellään tietokannan ja kokoelman nimi sekä dataobjekti sensoridatan käsittelyyn
const myDB   = client.db("sensordata2");
const myColl = myDB.collection("sensordata2");
var obj;

//odotetaan dataa välityspalvelimelta ja viedään data tietokantaan
mq.on('message', function (topic, message) {
    console.log(message.toString('utf8'));
    obj = JSON.parse(message);
    myColl.insertOne(obj);
    console.log(
        'An entry was inserted successfully',
    );
});