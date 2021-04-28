const express = require('express');
const app = express();
const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
// const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
// const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
// const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const twilioAccountSid = "AC9bfa1fba8f0a06a885a9cbe422a872d5";
const twilioApiKeySID = "SK7199af8dd2a9356a823770230e5e92a4";
const twilioApiKeySecret = "rVsIZ4tZNdSOlFQi5rxITUsxgdvUJ5Od";

app.use(express.static(path.join(__dirname, 'build')));

app.get('/token', (req, res) => {
  const uniqid = Date.now();
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzZkYWE3MmFlNWUyMWJiNTdlYTk3OGE1ZTExMjdiZmI3LTE1OTA3Mjg1MjIiLCJpc3MiOiJTSzZkYWE3MmFlNWUyMWJiNTdlYTk3OGE1ZTExMjdiZmI3Iiwic3ViIjoiQUM5YmZhMWZiYThmMGEwNmE4ODVhOWNiZTQyMmE4NzJkNSIsImV4cCI6MTU5MDczMjEyMiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiYnJvd3NlclRva2VuVHJpYWwiLCJ2aWRlbyI6eyJyb29tIjoiTXlSb29tIn19fQ.MuduUw9yfFeVdq5ihLxDUfZXfY0mr_nCO_YURjvk6oQ";
  token.identity = identity+'_'+uniqid;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  res.send(token);
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

app.listen(8081, () => console.log('token server running on 8081'));
