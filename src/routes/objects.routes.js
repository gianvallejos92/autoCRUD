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

export default router;
