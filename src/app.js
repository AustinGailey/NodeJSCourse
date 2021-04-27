const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('../utils/geocode.js')
const forecast = require('../utils/forecast.js')
const app = express()

//Express Config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


//Handlebars Setup
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup Static Directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Austin Gailey'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help'
    })
})

app.get('/about', (req,res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Austin Gailey'
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({ 
            error: 'You Must Enter a Location'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error){
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('products', (req,res) => {
    req.query   
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.send('Help Page Not Found')
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})