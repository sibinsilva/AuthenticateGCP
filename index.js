const express = require('express');
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
require('dotenv').config();

const client = new SecretManagerServiceClient();
const app = express();

app.get('/', async (req, res) => {
  try {
  // Access the secret value
  const secretValue = await accessSecretVersion();

  // Respond to the request
  res.status(200).send(secretValue);
  } 
catch (error) {
  console.error("Error:", error);
  res.status(500).send("Error retrieving secret value.");
}
});

async function accessSecretVersion() {
  const secretName = process.env.SECRET_NAME;

  if (!secretName) {
    throw new Error("Secret name environment variable not set.");
  }

  try {
    // Access the secret version
    const [version] = await client.accessSecretVersion({ name: secretName });

    // Extract the payload
    const payload = version.payload.data.toString();

    return payload;
  } catch (error) {
    console.error("Error accessing secret:", error);
    throw error;
  }
}



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});
