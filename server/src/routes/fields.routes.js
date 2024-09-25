import {Router} from 'express';
import pool from '../database.js';

const router = Router();

router.get('/field/list/:objectId', async(req, res) => {
  try {
    const database_Name = 'autocrud';  //Add constant to Utility Class
    const {objectId} = req.params;

    //Get API Name from Object table By Id
    const [objectQuery] = await pool.query('SELECT API_Name, Name FROM autocrud.object WHERE id = ?', objectId);
    const API_Name_val = objectQuery[0].API_Name;

    //Get Columns with it's type from the table API_Name
    const [result] = await pool.query('SHOW Columns FROM ' + API_Name_val + ' FROM ' + database_Name);

    res.render('fields/list', {fields: result, objectName: objectQuery[0].Name, objectId});

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

    //Get Object API_Name
    const [object] = await pool.query('SELECT API_Name FROM object WHERE id = ?', [objectId]);
    const Object_API_Name = object[0].API_Name;

    //Prepare Field Query
    let query = 'ALTER TABLE `' + Object_API_Name + '` ';
    query += ' ADD COLUMN `' + API_Name + '` ';
      
    if ( type === 'int') {
      query += ' INT ';
    } else if ( type === 'decimal') {
      query += ' DECIMAL(10,2) ';
    } else if ( type === 'date') {
      query += ' DATE ';
    }  else if ( type === 'datetime') {
      query += ' DATETIME ';
    } else {
      query += ' VARCHAR(255) ';
    }

    if (required === 'on') {
      query += ' NOT ';
    }
    query += ' NULL ';
    
    
    query += ' AFTER `id`';    

    console.log('Query: ' + query);
    await pool.query(query);
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
