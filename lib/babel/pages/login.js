class Login extends BasePage {
  _addListeners() {
    this._addLoginListener();
  }

  _addLoginListener() {
    let loginButton = document.querySelector(".login-container .login-button");
    loginButton.addEventListener("click", () => {
      GmailAPI.handleAuthClick();
    });
  }
}
