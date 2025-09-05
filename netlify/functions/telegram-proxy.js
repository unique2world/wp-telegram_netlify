const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const path = event.path.replace(/^\/proxy/, "");
  const telegramUrl = "https://api.telegram.org" + path;

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: ""
    };
  }

  try {
    const response = await fetch(telegramUrl, {
      method: event.httpMethod,
      headers: {
        "Content-Type": event.headers["content-type"] || "application/json",
        "Authorization": event.headers["authorization"] || ""
      },
      body: event.body && event.httpMethod !== "GET" && event.httpMethod !== "HEAD" ? event.body : undefined
    });

    const data = await response.text();
    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": response.headers.get("content-type") || "application/json"
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
