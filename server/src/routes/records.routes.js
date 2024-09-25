import {json, Router} from 'express';
import pool from '../database.js';

const router = Router();
const database_Name = 'autocrud'; //Add constant to Utility Class

router.get('/record/list/:objectId', async(req, res) => {
  try {   
    const {objectId} = req.params;

    //Get Object API_Name
    const [object] = await pool.query('SELECT Name, API_Name FROM object WHERE id = ?', [objectId]);
    const Object_API_Name = object[0].API_Name;

    //Get Columns with it's type from the table by Object_API_Name
    const [fieldNames] = await pool.query('SHOW Columns FROM ' + Object_API_Name + ' FROM ' + database_Name);
    const fields = generateFieldForAPI(fieldNames);

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

    res.render('records/list', {object: object[0].Name, records: records, fields: fields});

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


export default router;
