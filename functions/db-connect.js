const { Client } = require("pg");

exports.handler = async (event, context) => {
  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const result = await client.query("SELECT NOW()");
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Connected to Neon DB!",
        serverTime: result.rows[0].now,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
