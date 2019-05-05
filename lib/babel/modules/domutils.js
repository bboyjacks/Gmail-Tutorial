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

  const EmailList = (() => {
    const filterRelevantInfo = headers => {
      let result = {};
      let filteredHeaders = headers.filter(header => {
        return (
          header.name === "From" ||
          header.name === "Subject" ||
          header.name === "Date"
        );
      });

      filteredHeaders.forEach(header => {
        result[header.name] = header.value;
      });
      return result;
    };

    const createItem = (email, i) => {
      let emailList = document.querySelector(".email-list");
      let liItem = document.createElement("li");
      liItem.setAttribute("i", i);
      liItem.innerHTML = [
        `<div class="checkbox">`,
        `<input type="checkbox" name="email-item">`,
        `</div>`,
        `<div class="content">`,
        `<div class="message">`,
        `<div class="title">${email.title}</div>`,
        `<div class="sender">${email.sender}</div>`,
        `<div class="snippet">${email.snippet}</div>`,
        `<div class="date">${email.date}</div>`,
        `</div>`,
        `<div class="delete">`,
        `<i class="fas fa-trash-alt"></i>`,
        `</div>`,
        `</div>`,
        `</li>`
      ].join("");
      emailList.appendChild(liItem);
    };

    return {
      createItem: createItem,
      filterRelevantInfo: filterRelevantInfo
    };
  })();

  return {
    Container: Container,
    EmailList: EmailList
  };
})();
