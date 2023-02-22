const getAccessToken = async () => {
  const requestOptions = {
    method: "GET",
    credentials: "include",
  }

  const newToken = await fetch("/api/refresh", requestOptions)
    .then((response) => {
      if (response) {
        return response.json()
      }
    })
    .then((data) => {
      if (data) {
        return data.access_token
      }
      return null;
    })
    .catch((error) => console.error("user is not logged in", error))

  return newToken;
}


const logOut = (logoutCallback) => {
  const requestOptions = {
    method: "GET",
    credentials: "include",
  }

  fetch("/api/logout", requestOptions)
    .catch(error => console.error("error loging out", error))
    .finally(logoutCallback)

};

const logIn = (payload, successCallback, failCallback) => {
  const requestOptions = {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload)
  }

  fetch(`/api/authenticate`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        failCallback(data.message)
      } else {
        successCallback()
      }
    })
    .catch(error => {
      failCallback(error)
    })
}

export {getAccessToken, logOut, logIn}