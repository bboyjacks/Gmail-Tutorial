class Login {
  _show(html) {
    DomUtils.Container.show(html);
  }

  init() {
    Request.get("/_login")
      .then(html => {
        console.log(html);
        this._show(html);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
