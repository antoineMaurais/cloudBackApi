const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const personnesRouter = require('./routes/personne'); // Votre routeur personnalisé

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
