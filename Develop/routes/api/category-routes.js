// Importing Modules/Packages
const router = require('express').Router();
const { Category, Product } = require('../../models');


// Read Route
router.get('/', async (req, res) => {
  try {
    // gets all categories with associated Products
    const categories = await Category.findAll({ include: Product });
    res.json(categories);
  }
  catch (error) {
    console.error(`Something went wrong in the Category GET '/' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Read Specific Data Route
router.get('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id.replace(':', ''));

    // gets one category by its `id` value with associated Products
    const category = await Category.findByPk(categoryId, { include: Product });
    if (category) res.json(category);
    else res.status(404).json({ error: 'Category not found' });
  }
  catch (error) {
    console.error(`Something went wrong in the Category GET '/:${categoryId}' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Create Route
router.post('/', async (req, res) => {
  // create a new category
  const { name } = req.body;
  try {
    const newCategory = await Category.create({ name });
    res.json(newCategory);
  }
  catch(error) {
    console.error(`Something went wrong in the Category POST '/' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update Route
router.put('/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id.replace(':', ''));
  const { name } = req.body;
  try {
    // updates a category by its `id` value
    const [ updatedRows ] = await Category.update({ name }, { where: { id: categoryId } });

    if (updatedRows > 0) res.json({ message: 'Category updated successfully' });
    else res.status(404).json({ error: 'Category not found' });

  }
  catch (error) {
    console.error(`Something went wrong in the Category PUT '/:${categoryId}' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete Route
router.delete('/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id.replace(':', ''));
  try {
    // delete a category by its `id` value
    const deletedRows = await Category.destroy({ where: { id: categoryId } });
    
    if (deletedRows > 0) res.json({ message: 'Category deleted successfully' });
    else res.status(404).json({ error: 'Category not found' });

  }
  catch (error) {
    console.error(`Something went wrong in the Category DELETE '/:${categoryId}' route: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Exporting Module
module.exports = router;