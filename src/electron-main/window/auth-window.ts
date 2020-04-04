import { BrowserWindow } from 'electron';
// based on:
// http://iamemmanouil.com/blog/electron-oauth-with-github/
// https://github.com/ekonstantinidis/gitify

export {
  createAuthWindow,
}

var querystring = require('querystring');
var https = require("https");

function createAuthWindow() {
// Your GitHub Applications Credentials
  var options = {
    client_id: 'f1b780634e706618a15c',
    client_secret: '1bd3edb7169a50ba2812904c549c558b0f565127',
    scopes: ['read:user', 'gist'] // Scopes limit access for OAuth tokens.
  };

  var authWindow: BrowserWindow | null = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
    },
  });

  var githubUrl = 'https://github.com/login/oauth/authorize?';
  var authUrl = githubUrl + 'client_id=' + options.client_id + '&scope=' + options.scopes;
  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    var raw_code = /code=([^&]*)/.exec(newUrl) || null,
      code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
      error = /\?error=(.+)$/.exec(newUrl);

    if (code || error) {
      // Close the browser if code found or error
      authWindow?.close();
    }

    // If there is a code in the callback, proceed to get token from github
    if (code) {
      console.log("code recieved: " + code);

      var postData = querystring.stringify({
        "client_id": options.client_id,
        "client_secret": options.client_secret,
        "code": code
      });

      var post = {
        host: "github.com",
        path: "/login/oauth/access_token",
        method: "POST",
        headers:
          {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length,
            "Accept": "application/json"
          }
      };

      var req = https.request(post, function (response) {
        var result = '';
        response.on('data', function (data) {
          result = result + data;
        });
        response.on('end', function () {
          var json = JSON.parse(result.toString());
          console.log("access token recieved: " + json.access_token);
          if (response && response.ok) {
            // Success - Received Token.
            // Store it in localStorage maybe?
            console.log(response.body.access_token);
          }
        });
        response.on('error', function (err) {
          console.log("GITHUB OAUTH REQUEST ERROR: " + err.message);
        });
      });

      req.write(postData);
      req.end();
    } else if (error) {
      alert("Oops! Something went wrong and we couldn't log you in using Github. Please try again.");
    }
  });

// Reset the authWindow on close
  authWindow.on('close', function () {
    authWindow = null;
  });
}
