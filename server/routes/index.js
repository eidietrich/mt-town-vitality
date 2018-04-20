var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/api/place/population/:fips', db.getPlacePopulation)
router.get('/api/school/enrollment/hs/:le_code', db.getDistrictHSEnrollment)
router.get('/api/county/population/:fips', db.getCountyPopulation)
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MONTANA' });
});

module.exports = router;
