import {json, Router} from 'express';
import pool from '../database.js';

const router = Router();

router.get('/api', async(req, res) => {
  try {
    res.json({
      "records": [
      {
        "line": 0,
        "values": [
          {
            "value": "Gian"
          },
          {
            "value": "Vallejos"
          },
          {
            "value": "31"
          }
        ]
      },
      {
        "line": 1,
        "values": [
          {
            "value": "Piere"
          },
          {
            "value": "Bardales"
          },
          {
            "value": "28"
          }
        ]
      },
      {
        "line": 2,
        "values": [
          {
            "value": "Joaquin"
          },
          {
            "value": "Valdivia"
          },
          {
            "value": "21"
          }
        ]
      }
      ],
      "fields": [
        {
          "id": 1,
          "name": "Name"
        },
        {
          "id": 2,
          "name": "LastName"
        },
        {
          "id": 3,
          "name": "Edad"
        }
      ]
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
})

router.get('/record/list/:id', async(req, res) => {
  try {    

    const {id} = req.params;

    let objectQuery = 'select name from object WHERE id = ?';
    const [objectResult] = await pool.query(objectQuery, [id]);

    let fieldQuery = 'select id, name from field WHERE ObjectId = ?';
    const [fieldResult] = await pool.query(fieldQuery, [id]);

    let recordQuery =  'SELECT * FROM record WHERE fieldId IN (';
        recordQuery +=   'SELECT * FROM (';
        recordQuery +=     'SELECT Id FROM field WHERE ObjectId = ?';
        recordQuery +=   ') AS subquery';
        recordQuery += ') ORDER BY id';

    const [recordResult] = await pool.query(recordQuery, [id]);
    
    const recordsSplitted = generateRecordsPerLine(recordResult, fieldResult.length);
/*
    res.status(200).json({
      object: objectResult[0],
      records: recordsSplitted,
      fields: fieldResult
    })
*/
    res.render('records/list', {object: objectResult[0], records: recordsSplitted, fields: fieldResult});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

const generateRecordsPerLine = (recordResult, fieldsSize) => {
  let recordValues = prepareRecordValues(recordResult, fieldsSize);
  let recordsJson = generateRecordJSON(recordValues);
  return recordsJson;
}

const prepareRecordValues = (recordResult, fieldsSize) => {
  let arr = [];
  let aux = [];
  recordResult.map((record, ind) => {  
    if (ind % fieldsSize === 0) {
      if (aux.length !== 0) { arr.push(aux); }
      aux = [];      
    }
    aux.push({"value": record.value});
  });  

  if (aux.length !== 0) { arr.push(aux); }
  
  return arr;
}

const generateRecordJSON = (recordValues) => {
  let result = [];
  recordValues.forEach((items, ind) => {
    result.push({
      "line": ind,
      "values": items
    });
  });
  return result;
}

export default router;
