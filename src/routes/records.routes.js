import {Router} from 'express';
import pool from '../database.js';

const router = Router();

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

    const recordsSplitted = generateRecordsByFields(recordResult);
    //generateHTML(fieldResult, recordsSplitted);

    res.render('records/list', {object: objectResult[0], records: recordsSplitted, fields: fieldResult});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

const generateRecordsByFields = (recordResult) => {
  let newObject = {};
  Object.values(recordResult).forEach(it => {
    if (newObject[parseInt(it.fieldId)-1]) {
      let aux = newObject[parseInt(it.fieldId)-1];
      aux.push(it.value);
      newObject[parseInt(it.fieldId)-1] = aux;
    }
    else {
      newObject[parseInt(it.fieldId)-1] = [it.value];
    }
  });
  return newObject;
}

/* FRONTEND BEGIN */
const generateHTML = (fieldResult, recordsResult) => {
  let HTMLfields = generateHTMLFields(fieldResult);
  let HTMLrecords = generateHTMLRecords(recordsResult);
}

const generateHTMLFields = fieldResult => {
  let HTMLfields = '<tr>';
  Object.values(fieldResult).forEach(it => {
    HTMLfields += '<th>';
    HTMLfields += it.name;
    HTMLfields += '</th>';
  });
  HTMLfields += '</tr>';
  return HTMLfields;
}

const generateHTMLRecords = recordsResult => {
  let HTMLrecords = '';
  Object.values(recordsResult).forEach(it => {
    HTMLrecords += '<tr>';    
    it.forEach(cur => {
      HTMLrecords += '  <td>';
      HTMLrecords += cur;
      HTMLrecords += '  </td>';
    });    
    HTMLrecords += '</tr>';    
  });
  return HTMLrecords;
}
/* FROTEND END */

export default router;
