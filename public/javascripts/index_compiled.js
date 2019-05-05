"use strict";

window.onload = function () {
  GmailAPI.handleClientLoad();
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Main =
/*#__PURE__*/
function () {
  function Main() {
    _classCallCheck(this, Main);

    this.pages = {
      login: {
        page: new Login(),
        url: "/_login"
      },
      emails: {
        page: new Emails(),
        url: "/_emails"
      }
    };
  }

  _createClass(Main, [{
    key: "init",
    value: function init() {
      var login = this.pages.login;
      login.page.init(login.url);
    }
  }, {
    key: "show",
    value: function show(page) {
      var currentpage = this.pages[page];
      currentpage.page.init(currentpage.url);
    }
  }]);

  return Main;
}();
"use strict";

var DomUtils = function () {
  var Container = function () {
    var show = function show(html) {
      var container = document.querySelector(".container");
      container.innerHTML = "";
      container.innerHTML = html;
    };

    return {
      show: show
    };
  }();

  var EmailList = function () {
    var filterRelevantInfo = function filterRelevantInfo(headers) {
      var result = {};
      var filteredHeaders = headers.filter(function (header) {
        return header.name === "From" || header.name === "Subject" || header.name === "Date";
      });
      filteredHeaders.forEach(function (header) {
        result[header.name] = header.value;
      });
      return result;
    };

    var createItem = function createItem(email, snippet, id, timesignature) {
      var liItem = document.createElement("li");
      liItem.setAttribute("timesignature", timesignature);
      liItem.setAttribute("id", id);
      liItem.innerHTML = ["<div class=\"checkbox\">", "<input type=\"checkbox\" name=\"email-item\">", "</div>", "<div class=\"content\">", "<div class=\"message\">", "<div class=\"title\">".concat(email.title, "</div>"), "<div class=\"sender\">".concat(email.sender, "</div>"), "<div class=\"snippet\">".concat(snippet, "</div>"), "<div class=\"date\">".concat(email.date, "</div>"), "</div>", "<div class=\"delete\">", "<i class=\"fas fa-trash-alt\"></i>", "</div>", "</div>", "</li>"].join("");
      var emailList = document.querySelector(".email-list");
      var children = emailList.children;

      if (children.length === 0) {
        emailList.appendChild(liItem);
      } else {
        var inserted = false;

        for (var i = 0; i < children.length; i++) {
          if (timesignature <= children[i].timesignature) {
            emailList.insertBefore(liItem, children[i]);
            inserted = true;
            break;
          }
        }

        if (!inserted) {
          emailList.appendChild(liItem);
        }
      }
    };

    return {
      createItem: createItem,
      filterRelevantInfo: filterRelevantInfo
    };
  }();

  return {
    Container: Container,
    EmailList: EmailList
  };
}();
"use strict";

var CLIENT_ID = "1065554698398-s4iohb0h1gvghgjke8c86kor83nv7eui.apps.googleusercontent.com";
var API_KEY = "AIzaSyCsc5U7hYeA-AtYa2cILZlCbP8KnmgPRo8";
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
var SCOPES = "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";

var GmailAPI = function () {
  function handleClientLoad() {
    gapi.load("client:auth2", _initClient);
  }

  var _initClient = function _initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function (resp) {
      gapi.auth2.getAuthInstance().isSignedIn.listen(_updateSigninStatus);

      _updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    })["catch"](function (err) {
      console.log(err);
    });
  };

  var _updateSigninStatus = function _updateSigninStatus(isSignedIn) {
    var main = new Main();

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

  function getEmailList(options) {
    return new Promise(function (resolve, reject) {
      gapi.client.gmail.users.messages.list(options).then(function (resp) {
        resolve(resp);
      })["catch"](function (err) {
        reject(err);
      });
    });
  }

  function getEmail(options) {
    return new Promise(function (resolve, reject) {
      gapi.client.gmail.users.messages.get(options).then(function (resp) {
        resolve(resp);
      })["catch"](function (err) {
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
}();
"use strict";

var LocalStorage = function () {
  /**
   * This gives the status of users sign in
   *
   * Returns boolean
   */
  var getSignInStatus = function getSignInStatus() {
    var data = localStorage.getItem("sign-in-status");

    if (data) {
      data = JSON.parse(data);
      var currentTime = new Date().getTime();

      if (currentTime - data.time > 600) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  };
  /**
   * sets the sign in status
   */


  var setSignInStatus = function setSignInStatus(signedIn) {
    var data = localStorage.getItem("sign-in-status");

    if (data) {
      data = JSON.parse(data);
      data.status = signedIn;
      data.time = new Date().getTime();
      localStorage.setItem("sign-in-status", JSON.stringify(data));
    } else {
      var newStatus = {
        status: signedIn,
        time: new Date().getTime()
      };
      localStorage.setItem("sign-in-status", JSON.stringify(newStatus));
    }
  };

  return {
    getSignInStatus: getSignInStatus,
    setSignInStatus: setSignInStatus
  };
}();
"use strict";

var Request = function () {
  var get = function get(url) {
    return new Promise(function (resolve, reject) {
      fetch(url).then(function (resp) {
        return resp.text();
      }).then(function (html) {
        resolve(html);
      })["catch"](function (err) {
        reject(err);
      });
    });
  };

  return {
    get: get
  };
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BasePage =
/*#__PURE__*/
function () {
  function BasePage() {
    _classCallCheck(this, BasePage);
  }

  _createClass(BasePage, [{
    key: "_show",
    value: function _show(html) {
      DomUtils.Container.show(html);

      this._addListeners();
    }
  }, {
    key: "_addListeners",
    value: function _addListeners() {}
  }, {
    key: "init",
    value: function init(url) {
      var _this = this;

      Request.get(url).then(function (html) {
        _this._show(html);
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }]);

  return BasePage;
}();
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Emails =
/*#__PURE__*/
function (_BasePage) {
  _inherits(Emails, _BasePage);

  function Emails() {
    _classCallCheck(this, Emails);

    return _possibleConstructorReturn(this, _getPrototypeOf(Emails).apply(this, arguments));
  }

  _createClass(Emails, [{
    key: "_addListeners",
    value: function _addListeners() {
      this._addEmailsListener();

      this._populateEmailList();
    }
  }, {
    key: "_populateEmailList",
    value: function _populateEmailList() {
      GmailAPI.getEmailList({
        userId: "me",
        labelIds: ["INBOX"]
      }).then(function (resp) {
        return JSON.parse(resp.body);
      }).then(function (list) {
        list.messages.forEach(function (message) {
          GmailAPI.getEmail({
            userId: "me",
            id: message.id,
            format: "metadata"
          }).then(function (messageminimal) {
            var emailInfo = DomUtils.EmailList.filterRelevantInfo(messageminimal.result.payload.headers);
            DomUtils.EmailList.createItem({
              title: emailInfo.Subject,
              sender: emailInfo.From,
              date: new Date(emailInfo.Date)
            }, messageminimal.result.snippet, messageminimal.result.id, new Date(emailInfo.Date).getTime());
          })["catch"](function (err) {
            console.log(err);
          });
        });
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }, {
    key: "_addEmailsListener",
    value: function _addEmailsListener() {
      this._addEmailsContainerListener();

      this._addUserInfoListener();

      this._addSignOutListeners();

      this._addFoldersListener();
    }
  }, {
    key: "_addFoldersListener",
    value: function _addFoldersListener() {
      var foldersContainer = document.querySelectorAll(".folders > div");
      foldersContainer.forEach(function (folder) {
        folder.addEventListener("click", function (event) {
          foldersContainer.forEach(function (item) {
            item.classList.remove("toggled");
          });
          event.target.classList.toggle("toggled");
        });
      });
    }
  }, {
    key: "_addEmailsContainerListener",
    value: function _addEmailsContainerListener() {
      var emailsContainer = document.querySelector(".emails-container");
      emailsContainer.addEventListener("click", function (event) {
        var userInfo = document.querySelector(".user-info");

        if (event.target.classList[0] === "emails-container" && userInfo.classList.contains("show")) {
          var evObj = document.createEvent("Events");
          evObj.initEvent("click", true, false);
          var userButton = document.querySelector(".user-button");
          userButton.dispatchEvent(evObj);
        }
      });
    }
  }, {
    key: "_addUserInfoListener",
    value: function _addUserInfoListener() {
      var userButton = document.querySelector(".user-button");
      userButton.addEventListener("click", function () {
        userButton.classList.toggle("toggled");
        var userInfo = document.querySelector(".user-info");
        userInfo.classList.toggle("show");
      });
    }
  }, {
    key: "_addSignOutListeners",
    value: function _addSignOutListeners() {
      var signOutButton = document.querySelector(".sign-out");
      signOutButton.addEventListener("click", function () {
        GmailAPI.handleSignoutClick();
      });
    }
  }]);

  return Emails;
}(BasePage);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Login =
/*#__PURE__*/
function (_BasePage) {
  _inherits(Login, _BasePage);

  function Login() {
    _classCallCheck(this, Login);

    return _possibleConstructorReturn(this, _getPrototypeOf(Login).apply(this, arguments));
  }

  _createClass(Login, [{
    key: "_addListeners",
    value: function _addListeners() {
      this._addLoginListener();
    }
  }, {
    key: "_addLoginListener",
    value: function _addLoginListener() {
      var loginButton = document.querySelector(".login-container .login-button");
      loginButton.addEventListener("click", function () {
        GmailAPI.handleAuthClick();
      });
    }
  }]);

  return Login;
}(BasePage);
