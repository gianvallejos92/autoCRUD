import {Router} from 'express';
import pool from '../database.js';

const router = Router();

router.get('/field/list/:objectId', async(req, res) => {
  try {
    const {objectId} = req.params;
    const [result] = await pool.query('SELECT * FROM field WHERE objectId = ? LIMIT 1000', [objectId]);
    const [objectName] = await pool.query('SELECT Name as objectName FROM OBJECT WHERE Id = ? LIMIT 1', [objectId]);
    
    res.render('fields/list', {fields: result, objectName: objectName[0].objectName, objectId});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//Add Field
router.get('/field/add/:objectId', async(req, res) => {
  try {
    const {objectId} = req.params;
    res.render('fields/add', {objectId: objectId});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post('/field/add/:objectId', async(req, res) => {
  try {
    const {objectId} = req.params;
    const {Name, API_Name, type, required} = req.body;
    let isRequired = (required === 'on') ? true : false;
    const newObject = {
      Name, API_Name, type, isRequired, objectId
    }
    
    await pool.query('INSERT INTO field SET ?', [newObject]); //call insertField Procedure
    res.redirect('/field/list/' + objectId);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//Edit Object
router.get('/field/edit/:objectId/:id', async(req, res) => {
  try {
    const {id, objectId} = req.params;
    const [field] = await pool.query('SELECT id, Name, API_Name, isRequired FROM field WHERE id = ?', [id]); //call procedure
    const fieldEdit = field[0];

    res.render('fields/edit', { field: fieldEdit, fieldId: id, objectId });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post('/field/edit/:objectId/:id', async(req, res) => {
  try {
    const {Name, API_Name, type, required} = req.body;
    const {id, objectId} = req.params;
    let isRequired = (required === 'on') ? true : false;
    const newObject = {
      Name, API_Name, type, isRequired
    }

    await pool.query('UPDATE field SET ? WHERE id = ?', [newObject, id]); //call procedure
    
    res.redirect('/field/list/' + objectId);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;
