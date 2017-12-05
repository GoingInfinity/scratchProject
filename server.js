let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
// let pg = require('pg');
const { Pool, Client } = require('pg')
let cors = require('cors');
const PORT = 3000;

const connectionString = 'postgres://lntjpzrb:WqEJbb3UKzjRlZ9SfCFO7GQ4itHsYl9j@baasu.db.elephantsql.com:5432/lntjpzrb';

// const pool = new Pool({
//   // user: 'postgres',
//   // database: 'tiffanylin',  
//   // password: 'Chickens1',
//   // host: 'localhost',
//   // port: 5438,  
//   // max: 10
//   connectionString: connectionString,
//   user: 'lntjpzrb',
//   database: 'lntjpzrb',
//   password: 'WqEJbb3UKzjRlZ9SfCFO7GQ4itHsYl9j'
// });

const client = new Client({
  connectionString: connectionString,
})

client.connect()

// client.query('CREATE TABLE PERSONS (PersonID int, LastName varchar, LITTLEpuPPie varchar);', (err, res) => {
//   console.log(err, res)
//   client.end()
// })

// client.query('SELECT * FROM PERSONS', (err, res) => {
//   console.log(err, res)
//   client.end()
// })

// client.query('CREATE TABLE PERSONS2 (LITTLEpuPPie varchar);', (err, res) => {
//   console.log(err, res)
//   client.end()
// })


// client.query('CREATE TABLE PERSONS3 (littleKitten varchar);', (err, res) => {
//   console.log(err, res)
//   client.end()
// })


// client.query('INSERT INTO PERSONS3 (littleKitten) VALUES ($1)',["Cat"], (err, res) => {
//   console.log(err, res)
//   client.end()
// })


// client.query('INSERT INTO PERSONS3 (littleKitten) VALUES ($1)',["cow"], (err, res) => {
//   console.log(err, res)
//   client.end()
// })

// client.query('SELECT * FROM PERSONS3', (err, res) => {
//   console.log(err, res)
//   client.end()
// })


let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.delete('/api/remove/:id', function(request, response) {
  var id = request.params.id;
  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err);
    }
    else {
      db.query('DELETE FROM recipes WHERE id = $1', [Number(id)], function(err, result) {
        done();
        if(err) {
          return response.status(400).send(err);
        }
        else {
          return response.status(200).send({message: 'success in deleting record'});
        }
      })
    }
  })
})

app.get('/api/recipes', function(request, response) {
  pool.connect(function(err, db, done) {
    if(err) {
      return response.status(400).send(err);
    }
    else {
      db.query('SELECT * FROM recipes', function(err, table) {
        done();
        if(err) {
          console.log('table', table);
          return response.status(400).send(err);
        }
        else {
          return response.status(200).send(table.rows);
        }
      })
    }
  })
})

app.post('/api/new-recipe', function(request, response) {
  var recipe_name = request.body.recipe_name;
  // var continent_name = request.body.continent_name;
  var ingredients_name = request.body.ingredients_name;
  var description_name = request.body.description_name;
  var id = request.body.id;
  let values = [recipe_name, ingredients_name, description_name, id];
  // let values = [recipe_name, continent_name, id];
  pool.connect((err, db, done) => {
  if(err) {
    return response.status(400).send(err);
  } else {
    // db.query('INSERT INTO recipes (recipe_name, continent_name, id) VALUES($1, $2, $3)', [...values], (err, table) => {
    db.query('INSERT INTO recipes (recipe_name, ingredients_name, description_name, id) VALUES($1, $2, $3, $4)', [...values], (err, table) => {
      done();
      if(err) {
        return response.status(400).send(err);
      } else {
        console.log('DATA INSERTED');
        response.status(201).send({message: 'Data inserted!'});
      }
    })
  }
})
})

app.listen(PORT, () => console.log('Listening on port ' + PORT));

