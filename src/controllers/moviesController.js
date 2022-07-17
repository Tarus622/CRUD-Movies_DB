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
        let params = req.params.id
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie, params});
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
        let params = req.params.id

        Promise.all([movie, genres])
        .then(function([Movie, genreResult]) {
            res.render('moviesEdit.ejs', {Movie, genreResult})
        })

    },
    'update': function (req,res) {
        db.Movie.update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: req.params.id}
            }
        )
        .then(res.redirect('/movies'))
    },
    'delete': async function (req,res) {
        await db.Movie.findByPk(req.params.id)
        .then(Movie => res.render('moviesDelete.ejs', {Movie}))
    },
    'destroy': async function (req,res) {
        await db.Movie.findByPk(req.params.id)
            .then(db.Movie.destroy({
                where: {id: req.params.id}
            }))
            .then(res.redirect('/movies'))
    }
}

module.exports = moviesController;