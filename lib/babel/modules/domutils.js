const DomUtils = (() => {
  const Container = (() => {
    const show = html => {
      let container = document.querySelector(".container");
      container.innerHTML = "";
      container.innerHTML = html;
    };

    return {
      show: show
    };
  })();

  return {
    Container: Container
  };
})();
