import {Router} from 'express';
import pool from '../database.js';

const router = Router();

router.get('/object/list', async(req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM object LIMIT 1000');
    /*
    res.status(200).json({
      objects: result
    });
    */
    res.render('objects/list', {objects: result});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//Add Object
router.get('/object/add', async(req, res) => {
  try {
    res.render('objects/add');
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post('/object/add', async(req, res) => {
  try {
    const {Name, API_Name} = req.body;
    const newObject = {
      Name, API_Name
    }
    
    //Validate unique API_name in all databases 
    
    await pool.query('INSERT INTO Object SET ?', [newObject]); //call insertObject Procedure
    res.redirect('/object/list');

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//Edit Object
router.get('/object/edit/:id', async(req, res) => {
  try {
    const {id} = req.params;
    const [object] = await pool.query('SELECT id, Name, API_Name FROM object WHERE id = ?', [id]); //call procedure
    const objectEdit = object[0];

    res.render('objects/edit', { object: objectEdit });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post('/object/edit/:id', async(req, res) => {
  try {
    const {Name, API_Name} = req.body;
    const {id} = req.params;
    const objectEdit = {Name, API_Name};

    await pool.query('UPDATE object SET ? WHERE id = ?', [objectEdit, id]); //call procedure
    
    res.redirect('/object/list');

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get('/object/delete/:id', async(req, res) => {
  try {
    const {id} = req.params;
    await pool.query('DELETE FROM object WHERE id = ?', [id]); //call procedure
    res.redirect('/object/list');

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;
