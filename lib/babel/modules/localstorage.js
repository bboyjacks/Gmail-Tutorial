const LocalStorage = (() => {
  /**
   * This gives the status of users sign in
   *
   * Returns boolean
   */
  const getSignInStatus = () => {
    let data = localStorage.getItem("sign-in-status");
    if (data) {
      data = JSON.parse(data);
      let currentTime = new Date().getTime();
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
  const setSignInStatus = signedIn => {
    let data = localStorage.getItem("sign-in-status");
    if (data) {
      data = JSON.parse(data);
      data.status = signedIn;
      data.time = new Date().getTime();
      localStorage.setItem("sign-in-status", JSON.stringify(data));
    } else {
      let newStatus = {
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
})();
