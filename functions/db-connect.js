const { Client } = require("pg");

exports.handler = async () => {
  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, time: res.rows[0].now }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
