const { Console } = require('console');
const fs = require('fs');
const path = require('path');


function getAllProducts() {
	const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
	const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
	return products;
	
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		const products = getAllProducts();
		const visited = products.filter((product) => {
			return product.category == 'visited';
		});
		const inSale = products.filter((product) => {
			return product.category == 'in-sale';
		});

		res.render('index', {
			visitedProducts: visited,
			inSaleProducts: inSale
		});
	},
	search: (req, res) => {
		// obtener la info del formulario.
		// filtrar en la base de datos
		// almacenar en una variable
		// renderizar la vista
		const searched = req.query.keywords;
		const products = getAllProducts();
		const foundProduct = products.filter(product => product.name.toLowerCase().includes(searched))

		res.render('results', {
			product: foundProduct
		})
		
	},
};

module.exports = controller;
