const express = require("express");
const snacks = express.Router();
const confirmHealth = require("../confirmHealth.js");
const checkName = require('../validations/checkName.js');

//QUERIES//
const {
  getAllSnacks,
  getSnack,
  createSnack,
  updateSnack,
  deleteSnack,
} = require('../queries/snacks');

snacks.get("/", async (req, res) => { 
    const allSnacks = await getAllSnacks();
    if(allSnacks[0]){
        res.status(200).json({payload: allSnacks, success: true});
    }else{
        res.status(500).json({error: "server error"});
    };
});

snacks.get("/:id", async (req, res) => {
    const { id } = req.params;
    const snack = await getSnack(id);
    if(snack.id){
        res.json({payload: snack, success: true});
    }else{
        res.status(404).json({payload: "not found", success: false});
    };
});

snacks.post('/', async (req, res) => {
    const { body } = req;

    body.name = checkName(body);
    body.is_healthy = confirmHealth(body);

  try {
    const createdSnack = await createSnack(body);
    if (createdSnack.id) {
      res.status(200).json({
        success: true,
        payload: createdSnack
      });
    } else {
      res.status(422).json({
        success: false,
        payload: 'Must include name field'
      });
    }
  } catch (err) {
    console.log(err);
  }
});

snacks.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedSnack = await updateSnack(req.body, id);
  if (updatedSnack.id) {
    res.status(200).json(updatedSnack);
  } else {
    res.status(404).json({ error: 'Snack not found' });
  }
});


snacks.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const deletedSnack = await deleteSnack(id);
    if(deletedSnack.id){
        res.status(200).json({payload: deletedSnack, success: true});
    }else{
        res.status(404).json({payload: "not found", success: false});
    }
})

module.exports = snacks;
