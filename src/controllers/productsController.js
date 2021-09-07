const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const writeJSON = (dataBase) => {
	fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(dataBase), "utf-8")
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand
		})
	},

	// Detail from one product
	detail: (req, res) => {
		product = products.find(product => product.id === +req.params.id);

		res.render('detail', {
			product,
			toThousand
		})
	},

	// Create
	create: (req, res) => {
		res.render('product-create-form')
	},

	// Method to store
	store: (req, res) => {
		let lastId = 1;

		products.forEach(product => {
			if (product.id > lastId) {
				lastId = product.id
			}
		});

		let {
			name,
			price,
			discount,
			category,
			description } = req.body;

		let newProduct = {
			id: lastId + 1,
			name,
			price,
			discount,
			category,
			description,
			image: req.file ? req.file.filename : "default-image.png"
		};

		products.push(newProduct);
		writeJSON(products);

		res.redirect(`/products#${newProduct.id}`)
	},

	// Form to edit
	edit: (req, res) => {
		product = products.find(product => product.id === +req.params.id);

		res.render('product-edit-form', {
			product,
		})
	},

	// Method to update
	update: (req, res) => {
		let {
			name,
			price,
			discount,
			category,
			description } = req.body;

		products.forEach(product => {
			if (product.id === +req.params.id) {
				product.id = product.id,
				product.name = name,
				product.price = price,
				product.discount = discount,
				product.category = category,
				product.description = description,
				product.image = req.file ? req.file.filename : product.image
			}
		})

		writeJSON(products)

		res.send(`Has editado el producto${product.name}`)
	},

	// Delete one product 
	destroy: (req, res) => {
		product = products.find(product => product.id === +req.params.id);

		products.forEach(product => {
			if (product.id === +req.params.id) {
				const productToDestroy = products.indexOf(product);
				products.splice(productToDestroy, 1)
			}
		})

		writeJSON(products)

		res.send(`Has eliminado el producto${product.name}`)
	}
};


module.exports = controller;