var createError = require('http-errors'); //Importo la libreria per la gestione degli errori
var express = require('express');
var router = express.Router();
const sql = require('mssql');

const config = {
  user: 'tedesco.luca',  //Vostro user name
  password: 'xxx123#', //Vostra password
  server: "213.140.22.237",  //Stringa di connessione
  database: 'tedesco.luca', //(Nome del DB)
}

//Function to connect to database and execute query
let executeQuery = function (res, query, next, unit) {
  sql.connect(config, function (err) {
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    }
    var request = new sql.Request(); // create Request object
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();
        return;
      }
      renderPug(res, unit);
      return;
    });

  });
}

function renderPug(res, unit)
{
    let re = unit // oggetto re di tipo unit che è il risultato
    res.render('dettagli', {
          title: `Unità aggiunta: ${re.Unit}`,
          re: re,
    });
}

router.post('/add', function (req, res, next) {
  // Add a new Unit  
  let unit = req.body; // risultato della form in ADDUNIT.PUG 
  if (!unit) {  //Qui dovremmo testare tutti i campi della richiesta
    res.status(500).json({success: false, message:'Error while connecting database', error:err});
    return;
  }
  // oggetto che contiene la insert
  let sqlInsert = `INSERT INTO dbo.[cr-unit-attributes]
                     VALUES ('${unit.Unit}','${unit.Cost}','${unit.Hit_Speed}','${unit.Speed}','${unit.Deploy_Time}','${unit.Range}','${unit.Target}','${unit.Count}','${unit.Transport}','${unit.Type}','${unit.Rarity}')`;
  executeQuery(res, sqlInsert, next, unit);
});

router.get('/', function(req, res, next){
    res.render('addUnit', {
        title: 'Aggiungi una unità.',
    })
})

module.exports = router;