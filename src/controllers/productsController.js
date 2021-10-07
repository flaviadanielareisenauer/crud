const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const writeJson = (dataBase) => {
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
		let product = products.find(product => product.id === +req.params.id);

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
		// Primero capturamos el ultimo id, luego traemos los datos del req.body y creamos una variable (newProduct), asignandole los campos para poder crear este nuevo prodcuto y luego pushearlo al array. 
		let lastId = 1;

		products.forEach(product => {
			if (product.id > lastId) {
				lastId = product.id
			}
		});

		const {
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
		}

		products.push(newProduct);
		writeJson(products);

		res.redirect(`/products#${newProduct.id}`)
	},

	// Form to edit
	edit: (req, res) => {
		let product = products.find(product => product.id === +req.params.id);

		res.render('product-edit-form', {
			product
		})
	},

	// Method to update
	update: (req, res) => {
		// Me traigo el req.body (destructuracion) traigo el array de products, le aplico el metodo forEach a cada uno de los elementos que recorre y pregunto: si el producto que estoy recorriendo en este momento en su propiedad id es === a lo que me esta viniendo por parametro? de ser asi ese producto pasa a la validacion.
		const {
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

		writeJson(products)

		res.send(`Has editado el producto ${name}`)
	},

	// Delete one product 
	destroy: (req, res) => {
		let product = products.find(product => product.id === +req.params.id);

		products.forEach(product => {
			if (product.id === +req.params.id) {
				let productToDestroy = products.indexOf(product);
				products.splice(productToDestroy, 1)
			}
		})

		writeJson(products)

		res.send(`Has eliminado el producto ${product.name}`)
	}
};


module.exports = controller;