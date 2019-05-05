class Main {
  constructor() {
    this.pages = {
      login: new Login()
    };
  }

  init() {
    this.pages.login.init();
  }

  show(page) {
    this.pages[page].init();
  }
}
