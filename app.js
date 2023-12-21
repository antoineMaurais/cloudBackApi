const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const personnesRouter = require('./routes/personne'); // Votre routeur personnalisé
const mysql = require('mysql2');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/personnes', personnesRouter); // Utilisez le routeur pour les chemins commençant par '/personnes'

// Attrape les erreurs 404 et les passe au gestionnaire d'erreurs
app.use(function(req, res, next) {
    next(createError(404));
});

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
    host: '192.168.100.102', // Remplacez par l'adresse IP de votre VM MySQL
    user: 'admin',
    password: 'admin',
    database: 'cours', // Le nom de la base de données que vous avez créée
});

// Établissez la connexion à la base de données
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

// Assurez-vous que le module `mysql2` est disponible dans votre application Express
app.locals.db = db;

// Gestionnaire d'erreurs
app.use(function(err, req, res, next) {
    // Afficher les erreurs uniquement en développement
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Rendre la page d'erreur
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
