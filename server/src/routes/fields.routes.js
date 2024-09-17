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
    res.render('fields/add');
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post('/field/add', async(req, res) => {
  try {
    const {Name, API_Name} = req.body;
    const newObject = {
      Name, API_Name
    }
    
    //Validate unique API_name in all databases 
    
    await pool.query('INSERT INTO Object SET ?', [newObject]); //call insertObject Procedure
    res.redirect('/field/list/:id');

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;
