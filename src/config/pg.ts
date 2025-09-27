import { Pool } from "pg";

const pool = new Pool({
  host: "72.60.196.24",
  port: 5432,
  user: "kylemastercoder14",
  password: "Kyleandrelim14@",
  database: "onemarketphilippines",
});

export default pool;
