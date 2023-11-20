// Import Model
const Track = require('../models/track.model');

const fs = require('fs');

const log = data => console.log(JSON.stringify(data,undefined,2))

(async function() {

  try {

    const conn = await mongoose.connect(uri,options);

    // Clean data
    await Promise.all(
      Object.entries(conn.models).map(([k,m]) => m.deleteMany() )
    );


    // Create some instances
    let [musicdrake, musictravis] = ['musicdrake','musictravis'].map(
      name => new Track({ title })
    );

    let [drake, travis_scott] = ['Drake', 'Travis Scott'].map(
      name => new Author({ name })
    );

    let [rap, hiphop] = ['rap', 'hip-hop'].map(
        name => new Category({ name })
    );

    // Add tracks to authors
    [drake, travis_scott].forEach( author => {
        author.items.push(musicdrake);   // add drake to musicdrake
        musicdrake.stores.push(author);  // add musicdrake to drake
    });

    // Add tracks to category
    [rap, hiphop].forEach( category => {
        category.items.push(musicdrake);   // add rap to musicdrake
        musicdrake.stores.push(category);  // add musicdrake to rap
    });

    
    drake.items.push(musictravis);
    musictravis.stores.push(drake);

    rap.items.push(musictravis);
    musictravis.stores.push(rap);

    // Save everything
    await Promise.all(
      [drake, travis_scott, musictravis, musicdrake, rap, hiphop].map( m => m.save() )
    );


  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }

})();

const deleteImage = (filename) => {
    let path = `public/uploads/tracks/${filename}`;

    fs.access(path, fs.constants.F_OK, (err) => {
       if(err) {
        console.error(err);
        return;
       }

       fs.unlink(path, (err) => {
            if(err) throw err;
            console.log(`${filename} was deleted!`);
       });
    });
} 

// GET ALL
const readData = (req, res) => {

    Track.find({}).populate('user').populate('authors','-tracks').populate('categories', '-tracks')
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

    Track.findById(id).populate('user').populate('authors','-tracks').populate('categories', '-tracks')
        .then(data => {
            if(!data){
                res.status(404).json({ msg: `Track with ID: ${id} - Not Found!`});
            } else {
                res.status(200).json(data);
            }
        })
        .catch(err => {
            if(err.name === 'CastError'){
                res.status(404).json({ msg : `Track with ID: ${id} - Not Found!`})
            } else {
                console.error(err);
                res.status(500).json(err);
            }
        });
};

// (POST) CREATE NEW track
const createData = (req, res) => {

    console.log(req.body);
    let inputData = req.body;

    if(!req.user.admin){
        inputData.user = req.user._id;
    }

    if(req.file){
        inputData.image_path = req.file.filename
    }
    // include the following else if image is required
    else{
        return res.status(422).json({
            msg: " ❌ Image not uploaded ❌ "
        });
    }
    
    Track.create(inputData)
        .then(data => {
            console.log(`New Track Created`, data);
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

    if(req.file){
        body.image_path = req.file.filename
    }

    Track.findByIdAndUpdate(id, data, {
        new: false
    })
        .then((data) => {

            console.log(data);

            if(data){
                deleteImage(data.image_path);
                res.status(201).json(data);
            }
            else {
                deleteImage(body.image_path);
                res.status(404).json({
                    "message": `Track with id: ${id} not found`
                });
            }
            
        })
    .catch(err => {
        if(err.name === 'ValidationError'){
            res.status(422).json(err);
        } else if(err.name === 'CastError'){
            res.status(404).json({ msg : `Track with ID: ${id} - Not Found!`})
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
    let imagePath = '';

    Track.findById({ _id: id })
        .then((data) => {

            if(data){
                imagePath = data.image_path;
                return data.deleteOne();
            }
            else {
                res.status(404).json({
                    "message": `Track with id: ${id} not found`
                });
            }
            
        })
        .then(() => {
            deleteImage(imagePath);

            res.status(200).json({
                "message": `Track with id: ${id} deleted successfully`
            });
        })
        .catch((err) => {
            console.error(err);
            if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            else {
                res.status(500).json(err)
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