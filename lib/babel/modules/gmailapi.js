const CLIENT_ID =
  "1065554698398-s4iohb0h1gvghgjke8c86kor83nv7eui.apps.googleusercontent.com";
const API_KEY = "AIzaSyCsc5U7hYeA-AtYa2cILZlCbP8KnmgPRo8";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
];
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

const GmailAPI = (() => {
  function handleClientLoad() {
    gapi.load("client:auth2", _initClient);
  }

  const _initClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      })
      .then(resp => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(_updateSigninStatus);
        _updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      })
      .catch(err => {
        console.log(err);
      });
  };

  const _updateSigninStatus = isSignedIn => {
    let main = new Main();
    if (isSignedIn) {
      main.show("emails");
    } else {
      main.init();
    }
  };

  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  function getEmailList() {
    return new Promise((resolve, reject) => {
      gapi.client.gmail.users.messages
        .list({
          userId: "me"
        })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function getEmail(id, format) {
    return new Promise((resolve, reject) => {
      gapi.client.gmail.users.messages
        .get({
          userId: "me",
          id: id,
          format: format
        })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  return {
    getEmail: getEmail,
    getEmailList: getEmailList,
    handleClientLoad: handleClientLoad,
    handleAuthClick: handleAuthClick,
    handleSignoutClick: handleSignoutClick
  };
})();
