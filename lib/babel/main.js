class Main {
  constructor() {
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

  init() {
    let login = this.pages.login;
    login.page.init(login.url);
  }

  show(page) {
    let currentpage = this.pages[page];
    currentpage.page.init(currentpage.url);
  }
}
