const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const productsInSale = products.filter(product => product.category === "in-sale"); // De los productos traeme que en su propiedad category sean igual a "in-sale"
		const productsVisited = products.filter(product => product.category === "visited");

		res.render('index', {
			productsInSale,
			productsVisited,
			toThousand
		})
	},
	search: (req, res) => {
		const result = []
		// Le aplico un forEach para recorrer todos los productos, en cada producto le voy a preguntar si de ese producto que esto iterando en su propiedad name incluye lo que viene por req.query.keywords. Si incluye la palabra que pasamos por search, esta se agrega en la variable result y pushea el producto que encontro
		products.forEach(product => {
			if (product.name.toLowerCase().includes(req.query.keywords.toLowerCase())) {
				result.push(product)
			}
		});

		res.render('results', {
			result,
			toThousand,
			search: req.query.keywords
		})
	},
};


module.exports = controller;