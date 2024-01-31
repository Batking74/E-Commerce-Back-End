const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');


// Getting all tags with associated Product data
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          through: ProductTag,
          as: 'products'
        }
      ],
    });
    res.status(200).json(tags);
  }
  catch (err) {
    res.status(500).json(err);
  }
});


// Getting a single tag by its id with associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(parseInt(req.params.id.replace(':', '')), {
      include: [{ model: Product, through: ProductTag, as: 'products' }],
    });

    if (!tag) {
      res.status(404).json({ message: 'Tag not found with the provided id' });
      return;
    }

    res.status(200).json(tag);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// Creates a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// Updates a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: { id: parseInt(req.params.id.replace(':', '')) },
    });

    if (updatedTag[0] === 0) {
      res.status(404).json({ message: 'Tag not found with the provided id' });
      return;
    }

    res.status(200).json({ message: 'Tag updated successfully' });
  }
  catch (err) {
    res.status(500).json(err);
  }
});


// Deletes tag by its id
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: { id: parseInt(req.params.id.replace(':', '')) },
    });

    if (!deletedTag) {
      res.status(404).json({ message: 'Tag not found with the provided id' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
