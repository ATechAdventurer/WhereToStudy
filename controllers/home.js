/**
 * GET /
 * Home page.
 */
const Category = require('../models/Category')

exports.index = (req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  Category.find({}, "title marker", function(err, docs){
    var output = {};
    docs.forEach(cat => {
      output[cat.title] = cat
    })
    res.render('home', {
      title: 'Home',
      categories: JSON.stringify(output).replace("&quot;", '"')
    });  
  })
  
};
