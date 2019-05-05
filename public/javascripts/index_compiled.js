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

  return {
    Container: Container
  };
}();
"use strict";

var Request = function () {
  var get = function get(url) {
    return new Promise(function (resolve, reject) {
      fetch(url).then(function (resp) {
        return resp.text();
      }).then(function (html) {
        console.log({
          html: html
        });
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

window.onload = function () {
  var main = new Main();
  main.init();
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Login =
/*#__PURE__*/
function () {
  function Login() {
    _classCallCheck(this, Login);
  }

  _createClass(Login, [{
    key: "_show",
    value: function _show(html) {
      DomUtils.Container.show(html);
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      Request.get("/_login").then(function (html) {
        console.log(html);

        _this._show(html);
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }]);

  return Login;
}();
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
      login: new Login()
    };
  }

  _createClass(Main, [{
    key: "init",
    value: function init() {
      this.pages.login.init();
    }
  }, {
    key: "show",
    value: function show(page) {
      this.pages[page].init();
    }
  }]);

  return Main;
}();
