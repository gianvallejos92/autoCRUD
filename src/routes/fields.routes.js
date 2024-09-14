import {Router} from 'express';
import pool from '../database.js';

const router = Router();

router.get('/field/list/:objectId', async(req, res) => {
  try {
    const {objectId} = req.params;
    const [result] = await pool.query('SELECT * FROM field WHERE objectId = ? LIMIT 1000', [objectId]);
    /*
    res.status(200).json({
      fields: result
    });*/
    res.render('fields/list', {fields: result});
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;
