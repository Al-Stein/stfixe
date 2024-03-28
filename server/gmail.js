const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Watch the inbox for new messages periodically.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function watchInbox(auth) {
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread subject:CTRL", // Modify subject filter to CTRL
  });

  const messages = res.data.messages;
  if (!messages || messages.length === 0) {
    console.log("No new messages with 'CTRL' in the subject found.");
    return;
  }

  // Process each message
  for (const message of messages) {
    const messageRes = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
    });

    console.log("New message with 'CTRL' in the subject:");
    console.log(messageRes.data.snippet); // Log message snippet

    // Mark the message as seen
    await gmail.users.messages.modify({
      userId: "me",
      id: message.id,
      resource: {
        removeLabelIds: ["UNREAD"],
      },
    });
  }

  // Continue watching inbox
  watchInbox(auth);
}

authorize().then(watchInbox).catch(console.error);
