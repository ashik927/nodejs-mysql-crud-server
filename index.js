const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs= require('fs');
const fileUpload = require('express-fileupload');
var mysql = require('mysql');

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'interview'
});
  
// connect to database
dbConn.connect();

app.post('/add', function (req, res) {

    let country = req.body.country;
    let capital = req.body.capital;
    
    // validation
    if (!country || !capital)
        return res.status(400).send({ error:true, message: 'Please provide book country and capital' });

    // insert to db
    dbConn.query("INSERT INTO tbl_addcountry (country, capital) VALUES (?, ?)", [country, capital ], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Book successfully added' });
    });
});

app.get('/readdata', function (req, res) {
    dbConn.query('SELECT * FROM tbl_addcountry', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Books table is empty";
        else
            message = "Successfully retrived all books";

        return res.send({ data: results });
    });
});

app.get("/singlecountry/:id", function(req,res){
    const id= req.params.id;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide enter id' });
    }
    // let message = "";
    //     if (results === undefined || results.length == 0)
    //         message = "Book not found";
    //     else
    //         message = "Successfully retrived book data";

    dbConn.query("SELECT * FROM tbl_addcountry where id=?",id,function(err,results){
        res.send({ data: results[0]})
    });
})

app.delete('/datadelete',function(req,res){
    let id = req.body.id;

    dbConn.query('DELETE FROM tbl_addcountry where id=?',id,function(err,results){
        if(err){throw err}
        let message = "";
        if(results.affectedRows == 0){
            message = "book not found"
        }
        else{
            message = "book successfully delete"
        }
        return res.send({ data: results[0],message: message})
    })
})

app.put("/updatedata",function(req,res){
    let id = req.body.id;
    let country = req.body.country;
    let capital = req.body.capital;

    dbConn.query('UPDATE tbl_addcountry set country=?,capital=? WHERE id=?',[country,capital,id],function(err,results){
        if(err){throw err}
        let message = "";
        if(results.changedRows == 0){
            message = "please input";
        }
        else{
            message ="successfully updatedata";
        }
        return res.send({ data: results,message:message})
    });

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})