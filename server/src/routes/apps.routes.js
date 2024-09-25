import {Router} from 'express';
import pool from '../database.js';

const router = Router();

router.get('/app', async(req, res) => {
  try{
    const [objects] = await pool.query('SELECT id, Name, API_Name, Plural_Name FROM object LIMIT 1000');

    res.render('apps/list', {objects})

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }

});

export default router;
