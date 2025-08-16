const express = require('express');
const router = express.Router();

//item model
const Item = require('../../models/item');


// @route  GET api/items
// @desc   Get All Items
// @access Public

router.get('/', (req, res) => {
    Item.find()
    .sort({ date: -1})
    .then(items => res.json(items))
});

// @route  POST api/items
// @desc   Craete A Item
// @access Public

router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });

    newItem.save().then(item => res.json(item));
});

// @route  Delete api/items
// @desc   Delete A Item
// @access Public

router.delete('/:id', (req, res) => {
    Item.findByIdAndDelete(req.params.id)
        .then(item => {
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }
            res.json({ success: true });
        })
        .catch(err => res.status(400).json({ success: false, error: err.message }));
});



module.exports = router;

