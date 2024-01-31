// Importing Packages/Models
const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// get all products
router.get('/', async (req, res) => {
  // finding all products with all their associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name']
        },
        {
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      ]})
      res.json(products);
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// get one product
router.get('/:id', async (req, res) => {
  try {
    // finding a single product by its id
    const productId = parseInt(req.params.id.replace(':', ''));
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          attributes: ['id', 'category_name'],
        },
        {
          model: Tag,
          through: ProductTag,
          attributes: ['id', 'tag_name'],
        },
      ],
    });

    // Checking if the product was found
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  }
  catch (error) {
    console.error(`Error occured in finding a product by ID (findByPk) '/:id': ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve the product.' });
  }
});


// create new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// Update Product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: parseInt(req.params.id.replace(':', '')),
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: parseInt(req.params.id.replace(':', '')) }
        }).then((productTags) => {

          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: parseInt(req.params.id.replace(':', '')),
              tag_id,
            };
          });
          
          // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
          
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }
      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({ where: { id: parseInt(req.params.id.replace(':', '')) } })
  .then((deletedProduct) => {
    if (deletedProduct === 0) {
      res.status(404).json({ message: 'Sorry Product was not found...' });
    }
    else {
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
