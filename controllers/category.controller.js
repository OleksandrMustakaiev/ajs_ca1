// Import Model
const Category = require('../models/category.model');


// GET ALL
const readData = (req, res) => {

    Category.find({}).populate('tracks','-categories')
        .then((data) => {
            console.log(data);
            if(data.length > 0){
                res.status(200).json(data);
            } else{
                res.status(404).json('None found');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });

};

// GET BY ID
const readOne = (req, res) => {

    let id = req.params.id;

    Category.findById(id).populate('tracks','-categories')
        .then(data => {
            if(!data){
                res.status(404).json({ msg: `Category with ID: ${id} - Not Found!`});
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => {
            if(err.name === 'CastError'){
                res.status(404).json({ msg : `Category with ID: ${id} - Not Found!`})
            } else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

// (POST) CREATE NEW festival
const createData = (req, res) => {

    console.log(req.body);
    let inputData = req.body;
    
    Category.create(inputData)
        .then(data => {
            console.log(`New Category Created`, data);
            res.status(201).json(data)
        })
        .catch(err => {
            if(err.name === 'ValidationError'){
                res.status(422).json(err);
            } else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

// (PUT) UPDATE VALID festival
const updateData = (req, res) => {

    let id = req.params.id;
    let data = req.body;

    Category.findByIdAndUpdate(id, data, {
        new: true,
    })
    .then(newData => {
        res.status(201).json(newData);
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            res.status(422).json(err);
        } else if(err.name === 'CastError'){
            res.status(404).json({ msg : `Category with ID: ${id} - Not Found!`})
        }
         else {
            console.error(err);
            res.status(500).json(err);
        }
    });

};

// DELETE BY ID
const deleteData = (req, res) => {

    let id = req.params.id;

    Category.findByIdAndDelete(id)
        .then(newData => {

            if(!newData){
                res.status(404).json({ msg : `Category with ID: ${id} - Not Found!`})
            }
            res.status(201).json({ msg: `Category ${id} deleted!` });
        })
        .catch(err => {
            if(err.name === 'CastError'){
                res.status(404).json({ msg : `Category with ID: ${id} - Not Found!`})
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

module.exports = {
    readData,
    readOne,
    createData,
    updateData,
    deleteData
}