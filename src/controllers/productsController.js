const fs = require('fs');
const path = require('path');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const productsFilePath = path.resolve(__dirname, '../data/productsDataBase.json');

function getAllProducts(){

	const jsonProducts = fs.readFileSync(productsFilePath, 'utf-8');

	const productsParsed = JSON.parse(jsonProducts);

	return productsParsed;
}

function writeProducts(arrayToTransform) {
	const productsJson = JSON.stringify(arrayToTransform, null, " ");
	fs.writeFileSync(productsFilePath, productsJson);
}

function generateNewId(){
	const products = getAllProducts();
	return products.pop().id + 1;
}

const controller = {
	// Root - Show all products
	index: (req, res) => {

		const products = getAllProducts();

		res.render('products', {products: products});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const id = req.params.id;
		const products = getAllProducts();
		const result = products.find((product) => {
			return product.id == id
		})

		res.render('detail', {
			product: result
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res, next) => {
		// Do the magic
	
		const newProduct = {
			id: generateNewId(),
			name: req.body.name,
			price: req.body.price,
			discount: req.body.discount,
			category: req.body.category,
			description: req.body.description,
			image: req.files[0].filename
		}

		const products = getAllProducts();
		const productsToSave = [...products, newProduct];

		writeProducts(productsToSave);

		res.redirect('/');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const products = getAllProducts();
		const id = req.params.id;
		const result = products.find((product) => product.id == id);

		res.render('product-edit-form', {
			productToEdit: result
		})
		
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic

		// Editar un producto

		/*
			1) Traer los productos
			2) Recorrer y contruir nuestro nuevo array
			3) Identificar el elemento que quiero modificar
			4) Editar el producto
			5) Escribir el json con la nueva data
				A) Convertir mi array de JS en un string (JSON)
				B) Escribo mi .JSON con el string creado en el item anterior
			6) Redirijo al usuario a donde quiera
		*/
		const products = getAllProducts();

		const id = req.params.id;
		
		const newProducts = products.map((product) => {

			if(id == product.id){
				product.name = req.body.name;
				product.price = req.body.price;
				product.discount = req.body.discount;
				product.category = req.body.category;
				product.description = req.body.description;
				product.image = req.files[0] ? req.files[0].filename : product.image;
			}

			return product;
		});

		writeProducts(newProducts);

		res.redirect("/products/detail/" + id);
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
	}
};

module.exports = controller;