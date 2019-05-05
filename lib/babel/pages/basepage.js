class BasePage {
  _show(html) {
    DomUtils.Container.show(html);
    this._addListeners();
  }

  _addListeners() {}

  init(url) {
    Request.get(url)
      .then(html => {
        this._show(html);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
