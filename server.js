const express = require('express')
const app = express()
const ShortUrl = require('./models/shortUrl')
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost/urlShortener', {
	useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req,res) => {
	const shorturl = await ShortUrl.find()
	const url = await ShortUrl.find().sort({_id:-1}).limit(1)
	res.render('index', {shortUrls: shorturl, url:url[0]})
})

app.post('/shortUrls', async (req,res) => {
	await ShortUrl.create({ full: req.body.fullURL })
	res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
	if (shortUrl == null) return res.sendStatus(404)

	shortUrl.clicks++
	shortUrl.save()
	res.redirect(shortUrl.full)
})


app.listen(process.env.PORT || 5000)