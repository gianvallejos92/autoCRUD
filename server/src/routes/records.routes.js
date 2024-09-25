import {json, Router} from 'express';
import pool from '../database.js';

const router = Router();
const database_Name = 'autocrud'; //Add constant to Utility Class

router.get('/record/list/:objectId', async(req, res) => {
  try {   
    const {objectId} = req.params;
/* Move this to Utility Class */
    //Get Object API_Name
    const [object] = await pool.query('SELECT Name, API_Name FROM object WHERE id = ?', [objectId]);
    const Object_API_Name = object[0].API_Name;

    //Get Columns with it's type from the table by Object_API_Name
    const [fieldNames] = await pool.query('SHOW Columns FROM ' + Object_API_Name + ' FROM ' + database_Name);
    const fields = generateFieldForAPI(fieldNames);
/* End Move this to Utility Class */

    //Get Records from the table by Object_API_Name
    const [recordResult] = await pool.query('SELECT * FROM `' + Object_API_Name + '`');
    const records = generateRecordsForAPI(recordResult, fields);
    
/*
    res.status(200).json({
      object: object[0].Name,
      records: records,
      fields: fields
    })
*/

    res.render('records/list', {object: object[0].Name, records: records, fields: fields, objectId});

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

//Move to Handler Class
const generateFieldForAPI = (fieldNames) => {
  let arr = [];
  fieldNames.map((field) => {
    arr.push({
      "name": field.Field, 
      "type": field.Type,
      "required": (field.Null === "NO") ? true : false
    });
  });
  return arr;
}

const generateRecordsForAPI = (recordResult, fields) => {
  let arrs = [];
  recordResult.map((record, ind) => {
    let values = [];
    fields.forEach(curField => {
      values.push({ "value": record[curField.name] });
    });
    arrs.push({ "line": ind, "values": values });
  });
  return arrs;
}

//Add Records
router.get('/record/add/:objectId', async(req, res) => {
  try {
    const {objectId} = req.params;    
/* Move this to Utility Class */
    //Get Object API_Name
    const [object] = await pool.query('SELECT Name, API_Name FROM object WHERE id = ?', [objectId]);
    const Object_API_Name = object[0].API_Name;
    const Object_Name = object[0].Name;

    //Get Columns with it's type from the table by Object_API_Name
    const [fieldNames] = await pool.query('SHOW Columns FROM ' + Object_API_Name + ' FROM ' + database_Name);
    const fields = generateFieldForAPI(fieldNames);
/* End Move this to Utility Class */
    const fieldsForInput = fields.splice(1, fieldNames.length-3);
/*
    res.status(200).json({
      object: Object_Name,
      fields: fieldsForInput
    })
*/

    res.render('records/add', {
      objectId, 
      Object_Name, 
      fields: fieldsForInput
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;
