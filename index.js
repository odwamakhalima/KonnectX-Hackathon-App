const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

const pg = require("pg");

const connectionString = process.env.DATABASE_URL || 'postgresql://warwick:pg123@localhost:5432/carsworkshop';

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const Pool = pg.Pool;
const pool = new Pool({
    connectionString,
    ssl: useSSL
});


let brandList = ["Nissan", "Toyota"]

app.post("/api/store_favorites", async (req, res, next) => {
    //console.log(favorites)
    try {
        // await pool.query(`DELETE FROM carfavorites`)
        let favorites = req.body.data
        for (var i = 0; i < favorites.length; i++) {
            await pool.query(`INSERT INTO carfavorites (favorites) VALUES ($1)`, [favorites[i]])
        }
        res.json({
            status : "success"
        })
    } catch (err) {
        // alert(err);
        console.log(err)
        res.json({
            status: "error"
    
        })
    }
});

app.get('/api/favorites', async (req, res, next) => {
    try {
        let theFavorites = []
        let favoritesExtraction = await pool.query(`SELECT favorites from carfavorites`)
        if (favoritesExtraction.rowCount !== 0) {
            let theFavorites = favoritesExtraction.rows
            res.json(theFavorites)
        } else {
            res.json(theFavorites);
        }

    } catch (err) {

        console.log(err)
        res.json({
            status: "error"
    
        })
        // alert(err);
    }
})








app.post("/api/brand_add", function (req, res) {
    //console.log(req.body.brand_name)
    brandList.push(req.body.brand_name)
    res.json({
        status: "success"
    })
})

app.get('/api/brand_list', function (req, res) {
    res.json(brandList)
});

app.post("/api/brands_delete", function (req, res) {
    brandList = []
    res.json({
        status: "success"
    })
})

const PORT = process.env.PORT || 3010;

app.listen(PORT, function () {
    console.log('started on: ', this.address().port);
});