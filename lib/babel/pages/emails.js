class Emails extends BasePage {
  _addListeners() {
    this._addEmailsListener();
    this._populateEmailList();
  }

  _populateEmailList() {
    GmailAPI.getEmailList()
      .then(resp => {
        return JSON.parse(resp.body);
      })
      .then(list => {
        list.messages.forEach((message, index) => {
          GmailAPI.getEmail(message.id, "metadata")
            .then(messageminimal => {
              let emailInfo = DomUtils.EmailList.filterRelevantInfo(
                messageminimal.result.payload.headers
              );
              DomUtils.EmailList.createItem(
                {
                  title: emailInfo.Subject,
                  sender: emailInfo.From,
                  snippet: messageminimal.result.snippet,
                  date: new Date(emailInfo.Date)
                },
                index
              );
            })
            .catch(err => {
              console.log(err);
            });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  _addEmailsListener() {
    this._addEmailsContainerListener();
    this._addUserInfoListener();
    this._addSignOutListeners();
    this._addFoldersListener();
  }

  _addFoldersListener() {
    let foldersContainer = document.querySelectorAll(".folders > div");
    foldersContainer.forEach(folder => {
      folder.addEventListener("click", event => {
        foldersContainer.forEach(item => {
          item.classList.remove("toggled");
        });

        event.target.classList.toggle("toggled");
      });
    });
  }

  _addEmailsContainerListener() {
    let emailsContainer = document.querySelector(".emails-container");
    emailsContainer.addEventListener("click", event => {
      let userInfo = document.querySelector(".user-info");
      if (
        event.target.classList[0] === "emails-container" &&
        userInfo.classList.contains("show")
      ) {
        let evObj = document.createEvent("Events");
        evObj.initEvent("click", true, false);

        let userButton = document.querySelector(".user-button");
        userButton.dispatchEvent(evObj);
      }
    });
  }

  _addUserInfoListener() {
    let userButton = document.querySelector(".user-button");
    userButton.addEventListener("click", () => {
      userButton.classList.toggle("toggled");
      let userInfo = document.querySelector(".user-info");
      userInfo.classList.toggle("show");
    });
  }

  _addSignOutListeners() {
    let signOutButton = document.querySelector(".sign-out");
    signOutButton.addEventListener("click", () => {
      GmailAPI.handleSignoutClick();
    });
  }
}
