const express = require('express')
const app = express();
const bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/baza";
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());


//-------------------------------------------SELECT--------------------------------------------------------------
app.post('/user', (req, res) => {
    let email = req.body.email;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        // dbo.createIndex({email: -1});
        dbo.collection("user").findOne({email: email}, function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.post('/sve', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        dbo.collection("oglasi").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.post('/kategorija', (req, res) => {
    let kategorija = req.body.kategorija;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        //  dbo.createIndex({kategorija: -1});
        dbo.collection("oglasi").find({kategorija: kategorija}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.post('/model', (req, res) => {
    let model = req.body.model;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        var query = {model: model};
        dbo.collection("oglasi").find(query).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.post('/moji', (req, res) => {
    let user_email = req.body.user_email;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        // dbo.createIndex({user_email: -1});
        var query = {user_email: user_email};
        dbo.collection("oglasi").find(query).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.post('/mojiMod', (req, res) => {
    let user_email = req.body.user_email;
    let oglas_id = req.body.oglas_id;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        dbo.collection("oglasi").find({
            user_email: user_email,
            "_id": ObjectId(oglas_id)
        }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.post('/lajkovani', (req, res) => {
    let user_email = req.body.user_email;
    var array = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        dbo.collection("lajkovani").find({user_email: user_email}).toArray(function (err, result) {
            if (err) throw err;
            array = result.map(data => new ObjectId(data.oglas_id));
            console.log(array)
            var options =
                {$in: [ObjectId("5c61a4bd112685188cf50acf")]}

            dbo.collection("oglasi").find({ _id: { $in: array } }).toArray(function (err, result) {
                console.log("WIN: ", result)
                res.json(result);
            })

            db.close();
        });
    });

    /*  MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          var dbo = db.db("baza");
          console.log('drugi: ', array);
          if (array !== null || array !== undefined) {
              array.forEach(element => {
                  dbo.collection("oglasi").find({"_id": ObjectId(element.oglas_id)}).toArray(function (err, result) {
                      if (err) throw err;
                      res.json(result);
                  });
                  console.log(122);

              });
          }
          db.close();
      });*/
});
//---------------------------------------DELETE---------------------------------------------

app.post('/delete', function (req, res) {
    let oglas_id = req.body.oglas_id;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        dbo.collection("oglasi").deleteOne({"_id": ObjectId(oglas_id)}, function (err, result) {
            if (err) throw err;
            res.json(true);
            db.close();
        });
    });
});

//-----------------------------------------------INSERT------------------------------------------------

app.post('/insert', function (req, res) {
    let kategorija = req.body.kategorija;
    let grupa = req.body.grupa;
    let model = req.body.model;
    let naslov = req.body.naslov;
    let stanje = req.body.stanje;
    let slike = req.body.slike;
    let opis = req.body.opis;
    let cena = parseInt(req.body.cena);
    let datum = req.body.datum;
    let lajkovi = parseInt(req.body.like);
    let user_email = req.body.user_email;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        var myobj = {
            kategorija: kategorija, model: model, naslov: naslov, stanje: stanje,
            slike: slike, opis: opis, cena: cena, datum: datum, lajkovi: lajkovi, user_email: user_email
        };
        if (err) throw err;
        dbo.collection("oglasi").insertOne(myobj, function (err, res) {
            db.close();
        });
    });
});

app.post('/insert_user', function (req, res) {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let password = req.body.password;
    let slika = req.body.slika;
    let email = req.body.email;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        var myobj = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password,
            slika: slika,
            email: email
        };
        dbo.collection("user").insertOne(myobj, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });

});

//------------------------------------------------------UPDATE--------------------------------------------------

app.post('/update', function (req, res) {
    let kategorija = req.body.kategorija;
    let grupa = req.body.grupa;
    let model = req.body.model;
    let naslov = req.body.naslov;
    let stanje = req.body.stanje;
    let slike = req.body.slike;
    let opis = req.body.opis;
    let cena = req.body.cena;
    let datum = req.body.datum;
    let oglas_id = req.body.oglas_id;
    let user_email = req.body.user_email;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        var myquery = {"_id": ObjectId(oglas_id)};
        var newvalues = {
            $set: {
                kategorija: kategorija, grupa: grupa, model: model, naslov: naslov, stanje: stanje,
                slike: slike, opis: opis, cena: cena, datum: datum, lajkovi: lajkovi, user_email: user_email
            }
        };
        dbo.collection("oglasi").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
});

app.post('/lajkuj', (req, res) => {
    let oglas_id = req.body.oglas_id;
    let user_email = req.body.user_email;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        var myquery = {"_id": ObjectId(oglas_id)};
        var newvalues = {$inc: {lajkovi: 1}};
        dbo.collection("oglasi").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("baza");
        var myobj = {user_email: user_email, oglas_id: oglas_id};
        dbo.collection("lajkovani").insertOne(myobj, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
});

//--------------------------------------------------------------------------------------------

app.listen(3001, function () {
    console.log('Server running')
});
