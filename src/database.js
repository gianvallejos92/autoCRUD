import { createPool } from "mysql2/promise";

const pool = createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '', //Set your password
  database: 'autocrud'
});

export default pool;
