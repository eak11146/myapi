const express = require('express');
const cors = require('cors');
const mysql =require('mysql2');
require('dotenv').config();

const bodyParser = require('body-parser');

const app = express();
/* // Middleware เพื่อให้สามารถอ่านข้อมูลแบบ JSON และ x-www-form-urlencoded ได้
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // เพิ่ม middleware นี้ */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.get('/',function(req,res,next ){
    res.json ({ msg : "Hello !!"})
});


app.get('/attractions',function(req,res,next){
    connection.query(
        "SELECT * FROM attractions",
        function (err,results,fields){
            res.json(results)
        }
    )
});

app.get('/attractions/:id',function(req,res,next){
    const id = req.params.id
    connection.query(
        'SELECT * FROM attractions WHERE id = ?',
        [id], function (err,results,fields){
            res.json(results[0])
        }
    )
});



// Create
app.post('/attractions/post', (req, res) => {
    const { name, detail,coverimage,latitude,longitude } = req.body;
    
    const sql = 'INSERT INTO attractions (name,detail,coverimage,latitude,longitude) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [name,detail,coverimage,latitude,longitude], (err, result) => {
        if (err) throw err;
        res.send('Place added');
        if (!req.body.name) {
            return res.status(400).send({ error: "Name is required" });
        }else{
            console.log(`Received name: ${name}, detail: ${detail} , coverimage: ${ coverimage } `);
        }
    }); 
    /* const { name, detail } = req.body; // รับข้อมูลจาก request body
    console.log(`Received name: ${name}, detail: ${detail}`);

    // ส่ง response กลับไปยัง client
    res.status(201).json({
        message: 'Data received successfully!',
        data: {
            name,
            detail,
        }
    }); */
});


// Delete
app.delete('/attractions/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM attractions WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send('attractions deleted');
    });
});



app.listen(process.env.PORT || 3000);
