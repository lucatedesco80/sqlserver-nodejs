var express = require('express');
var router = express.Router();
const sql = require('mssql');

const config = {
    user: 'tedesco.luca',  //Vostro user name
    password: 'xxx123#', //Vostra password
    server: "213.140.22.237",  //Stringa di connessione
    database: 'tedesco.luca', //(Nome del DB)
}

let executeQuery = function (res, query, next) { //query corrisponde ad sqlquery sotto nella get
  sql.connect(config, function (err) { //fa la connessione con l' ogetto config sopra e gli fa vedere l'errore
    if (err) { //Display error page
      console.log("Error while connecting database :- " + err);
      res.status(500).json({success: false, message:'Error while connecting database', error:err});
      return;
    } 
    // creo una variabile di tipo sql.request 
    var request = new sql.Request(); 
    
    request.query(query, function (err, result) { //Display error page
      if (err) {
        console.log("Error while querying database :- " + err);
        res.status(500).json({success: false, message:'Error while querying database', error:err});
        sql.close();  // chiude la richiesta ad sql
        return;
      }

            // gli manda la funzione
      MandaPug(res, result.recordset); // resul.recordset è il vettore con dentro il risultato
      return;
    });
    
  });
}

    
        function MandaPug(res, recordset) { //recordset è il risultato
            res.render('index', {
                title: 'Tutte le unità:',
                re: recordset //creo il classico oggetto per prendere le informazioni dal json 
            });
            
        }

         /* ESEGUE LA QUERY SUL SQL E RICHIAMA LA FUNZIONE EXECUTE*/
        router.get('/', function (req, res, next) {
            let sqlQuery = "select * from dbo.[cr-unit-attributes]";
            executeQuery(res, sqlQuery, next);  /*PASSA RES, SQLQUERY (LA QUERY) E L'ERRORE*/
    });

    module.exports = router;


     //Visualizzare il nome e la foto di tutte le unità in una pagina PUG.
     // punto1 anche index.pug 