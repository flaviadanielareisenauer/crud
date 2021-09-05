const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = (database) => {
	fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(dataBase), "utf-8")
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand
		})
	},
	// Detail - Detail from one product
	detail: (req, res) => {
		const product = products.find(product => product.id === +req.params.id);

		res.render('detail', {
			product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res) => {
		const lastID = 1;

		products.forEach(product => {
			if (product.id > lastId) {
				lastId = product.id
			}
		})

		const {
			name,
			price,
			discount,
			category,
			description } = req.body

		const newProduct = {
			id: lastId + 1,
			name,
			price,
			discount,
			category,
			description,
			image: req.file ? req.file.filename : "default-image.png"
		}

		products.push(newProduct)

		writeJson(products)

		res.redirect(`/products#${newProduct.id}`)
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find(product => product.id === +req.params.id);

		res.render('product-edit-form', {
			product,
		})



	},



















	// Update - Method to update
	update: (req, res) => {
		// Do the magic
	},















	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
	}
};

module.exports = controller;