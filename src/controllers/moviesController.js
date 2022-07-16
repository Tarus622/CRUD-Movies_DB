const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui têm uma maneira de chamar cada um dos modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aqui está outra maneira de chamar os modelos criados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({ 
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui estão as rotas para trabalhar com o CRUD
    'add': function (req, res) {
        db.Genre.findAll()
        .then(genres => {
            res.render('moviesAdd.ejs', {genres}) 
        })

    },
    'create': function (req,res) {
        db.Movie.create(req.body)
        .then(res.redirect('/movies'))
    },
    'edit': async function(req,res) {
        let movie = await db.Movie.findByPk(req.params.id)
        let genres = await db.Genre.findAll()

        Promise.all([movie, genres])
        .then(function([Movie, genreResult]) {
            genreResult.forEach(genre => {
                console.log(genre.id)
            });
            res.render('moviesEdit.ejs', {Movie, genreResult})
        })

    },
    update: function (req,res) {

    },
    delete: function (req,res) {

    },
    destroy: function (req,res) {

    }
}

module.exports = moviesController;