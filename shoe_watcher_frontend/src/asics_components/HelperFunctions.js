import store from "./app/store";
import { updatePanel, updateSearchState } from "./features/dataList/panelSlice";
import { updatePagination } from "./features/searchParameter/searchParamSlice";
import { updateLoginStatus } from "./features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const storeAuthInfo = (data) => {
  const tokenMap = new Map(Object.entries(JSON.parse(data)));
  localStorage.setItem("refresh", tokenMap.get("refresh"));
  localStorage.setItem("access", tokenMap.get("access"));
};

// used to update the login state after refresh
// redux state will be false after refresh
export function refreshLoginStat() {
  if (validateStoredJwt()) {
    store.dispatch(updateLoginStatus({ key: "loginStatus", value: true }));
  } else{
    store.dispatch(updateLoginStatus({ key: "loginStatus", value: false }));

    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
  }
}

// check if username and email exist
// make sure jwt is not expire yet (epoch time comparison) 
// unix epoch time is in seconds and Date.now returns in milliseconds
export function validateStoredJwt(){

  try{
    let cred = jwtDecode(localStorage.getItem("refresh"));
    if (cred.user !== "" && cred.email !== "" && Math.floor(Date.now() / 1000) < cred.exp )
    {
      return true
    }
  } catch (err)
  {
    console.log("ok")
  }
  localStorage.removeItem("refresh");
  localStorage.removeItem("access");
  return false
}

export function getJwtClaims() {
  let claim = { user: "", email: "" };
  if (validateStoredJwt()) {
    return jwtDecode(localStorage.getItem("refresh"));
  }

  return claim;
}

function refreshAccess(retryFunc = null) {
  const request = new XMLHttpRequest();
  request.addEventListener("readystatechange", () => {
    // in async request, ready state 4 is when the request is fully done
    // look at xml readystatechange for what each code means
    if (request.readyState === 4) {
      if (request.status === 200) {
        storeAuthInfo(request.responseText);

        // after refreshing the token, do a callback to rerun the failed function
        if (retryFunc !== null) {
          retryFunc();
        }
      } else {
        // if refresh token is expired
        // output a popup alert and set login as false
        store.dispatch(updateLoginStatus({ key: "loginStatus", value: false }));
        // store.dispatch(updateLoginStatus({ key: "expiredAuth", value: true }));
        localStorage.removeItem("refresh");
        localStorage.removeItem("access");
      }
    }
  });

  // if refresh token is missing for whatever reason
  // output a popup alert and set login as false
  if (localStorage.getItem("refresh") === null) {
    store.dispatch(updateLoginStatus({ key: "loginStatus", value: false }));
    // store.dispatch(updateLoginStatus({ key: "expiredAuth", value: true }));
  } else {
    request.open("POST", getSearchUrl("refresh"));
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({ refresh: localStorage.getItem("refresh") }));
  }
}

export function emailChecker(email) {
  const regex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;
  let m = regex.exec(email);
  return m !== null;
}

export function otpChecker(otp, email, successCallback, failCallback) {
  const request = new XMLHttpRequest();

  request.addEventListener("readystatechange", () => {
    // in async request, ready state 4 is when the request is fully done
    // look at xml readystatechange for what each code means
    if (request.readyState === 4) {
      if (request.status === 200) {
        successCallback();
      } else {
        failCallback(request.status);
      }
    }
  });

  const jsonData = {
    email: email,
    otp: otp,
  };

  request.open("POST", getSearchUrl("check_otp"));
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(jsonData));
}

export function getSearchUrl(api_name) {
  let uri = "";
  // let url = "http://localhost:8000";
  let url = "";

  switch (api_name) {
    case "search_engine":
      uri = url + "/search/getInfo/";
      break;
    case "slide_show":
      uri = url + "/search/slideShow/";
      break;
    case "notify":
      uri = url + "/member/signupNotify/";
      break;
    case "price_history":
      uri = url + "/search/searchPriceHistory/";
      break;
    case "login":
      uri = url + "/member/token/";
      break;
    case "logout":
      uri = url + "/member/logout/";
      break;
    case "my_account":
      uri = url + "/member/my_account/";
      break;
    case "refresh":
      uri = url + "/member/token/refresh/";
      break;
    case "signup":
      uri = url + "/member/register/";
      break;
    case "reset_password":
      uri = url + "/member/reset_password/";
      break;
    case "check_otp":
      uri = url + "/member/check_otp/";
      break;
    case "submit_reset":
      uri = url + "/member/submit_reset/";
      break;
    case "get_sub_list":
      uri = url + "/member/get_subscribe/";
      break;
    case "delete_sub_row":
      uri = url + "/member/delete_subscribe/";
      break;
    case "update_info":
      uri = url + "/member/update_info/";
      break;
  }

  return uri;
}
export function compareToStr(a, b) {
  if (a.shoe_name < b.shoe_name) {
    return -1;
  } else if (a.shoe_name > b.shoe_name) {
    return 1;
  }
  return 0;
}

export function compareToInt(a, b) {
  if (a.price < b.price) {
    return -1;
  } else if (a.price > b.price) {
    return 1;
  }
  return 0;
}

export function resetPassRequest(email) {
  const request = new XMLHttpRequest();

  request.addEventListener("readystatechange", () => {
    // in async request, ready state 4 is when the request is fully done
    // look at xml readystatechange for what each code means
    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log("send email to server");
      } else {
        console.log(request.responseText);
      }
    }
  });

  const jsonData = {
    email: email,
  };

  request.open("POST", getSearchUrl("reset_password"));
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(jsonData));
}

export function submit_reset(email, otp, password, success, failed) {
  const request = new XMLHttpRequest();

  request.addEventListener("readystatechange", () => {
    // in async request, ready state 4 is when the request is fully done
    // look at xml readystatechange for what each code means
    if (request.readyState === 4) {
      if (request.status === 200) {
        success();
        console.log("reset sucessful");
      } else if (request.status === 401) {
        failed(request.status);
        console.log("one time password has expired");
      } else {
        failed(request.status);
        console.log("server error, please try again later");
      }
    }
  });

  const jsonData = {
    email: email,
    otp: otp,
    password: password,
  };

  request.open("POST", getSearchUrl("submit_reset"));
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(jsonData));
}

export function getResult() {
  store.dispatch(updateSearchState("searching"));
  const request = new XMLHttpRequest();
  const dataList = [];

  request.addEventListener("readystatechange", () => {
    // in async request, ready state 4 is when the request is fully done
    // look at xml readystatechange for what each code means
    if (request.readyState === 4) {
      if (request.status === 200) {
        const data = request.responseText;
        const dataMap = new Map(Object.entries(JSON.parse(data)));
        store.dispatch(updatePanel(dataMap.get("result")));

        if (dataMap.get("result").length > 0) {
          store.dispatch(updateSearchState("done"));
        } else {
          store.dispatch(updateSearchState("empty"));
        }
        store.dispatch(
          updatePagination({
            token_key: dataMap.get("token_key"),
            token_value: dataMap.get("token_value"),
            sfccid: dataMap.get("sfccid"),
            hasNext: dataMap.get("hasNext"),
          })
        );
      } else {
        store.dispatch(updateSearchState("error"));
        console.log("error fetching data........................");
      }
    }
  });

  const jsonData = {
    gender: store.getState().searchParam.value.gender,
    condition: store.getState().searchParam.value.condition,
    shoe_name: store.getState().searchParam.value.shoe_name,
    sorting_style: store.getState().searchParam.value.sorting_style,
    search_limit: store.getState().searchParam.value.search_limit,
    min_price: store.getState().searchParam.value.min_price,
    max_price: store.getState().searchParam.value.max_price,
  };

  request.open("POST", getSearchUrl("search_engine"));
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(jsonData));

  return dataList;
}

export function login(username, password, onErrorCallback) {
  if (username.length > 0 && password.length > 0) {
    const request = new XMLHttpRequest();
    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      if (request.readyState === 4) {
        if (request.status === 200) {
          storeAuthInfo(request.responseText);
          onErrorCallback(true);
        } else {
          onErrorCallback(false);
        }
      }
    });
    const jsonData = {
      username: username,
      password: password,
    };
    request.open("POST", getSearchUrl("login"));
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(jsonData));
  }
}

export function doSearch() {
  if (store.getState().searchParam.value.shoe_name.length > 0) {
    getResult();
  }
}

// retry is for handling a weird error where the serevr return a 200 even though
// it can't refresh the refresh token, unable to reproduce the error
export function getMyAccount(retry = 3) {
  if (retry < 0) {
    return;
  }
  const request = new XMLHttpRequest();
  try {
    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      if (request.readyState === 4) {
        if (request.status === 200) {
          console.log(request.responseText);
        } else if (request.status === 401) {
          // refresh the token and get my account ONE more time
          // if the refresh token still fails, then log the user out
          refreshAccess(() => {
            getMyAccount(retry - 1);
          });
        } else {
          console.log("error fetching account page...");
          console.log(request.response);
        }
      }
    });
  } catch (err) {
    console.log("error");
  }

  request.open("GET", getSearchUrl("my_account"));
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("access")
  );
  try {
    request.send();
  } catch (err) {
    console.log("error2");
  }
}

// retry is for handling a weird error where the serevr return a 200 even though
// it can't refresh the refresh token, unable to reproduce the error
export function getSubscribeList(jsonData, processResult, retry = 3) {
  if (retry < 0) {
    refreshAccess()
    return;
  }
  const request = new XMLHttpRequest();
  try {
    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      if (request.readyState === 4) {
        if (request.status === 200) {
          try {
            const resultMap = new Map(
              Object.entries(JSON.parse(request.response))
            );
            console.log(resultMap.get("data"))
            processResult(resultMap.get("data"));
          } catch (err) {
            console.log(err);
          }
        } else if (request.status === 401) {
          // refresh the token and get my account ONE more time
          // if the refresh token still fails, then log the user out
          refreshAccess(() => {
            getSubscribeList(jsonData, processResult, retry - 1);
          });
        } else {
          console.log("error fetching subscribe list...");
          console.log(request.response);
        }
      }
    });
  } catch (err) {
    console.log("error");
  }

  request.open("POST", getSearchUrl("get_sub_list"));
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("access")
  );
  try {
    request.send(JSON.stringify(jsonData));
  } catch (err) {
    console.log("error2");
  }
}

export function delete_sub_row(jsonData, doneDelete, failDelete, retry=3){
  if (retry < 0) {
    return;
  }
  const request = new XMLHttpRequest();
  try {
    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 201) {
          // console.log(request.responseText);
          doneDelete()
          console.log("ok");
        } else if (request.status === 401) {
          // refresh the token and get my account ONE more time
          // if the refresh token still fails, then log the user out
          refreshAccess(() => {
            delete_sub_row(jsonData, doneDelete, failDelete , retry - 1);
          });
        } else {
          failDelete()
          console.log("error fetching account page...");
          console.log(request.response);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  request.open("DELETE", getSearchUrl("delete_sub_row"));
  request.setRequestHeader("Content-Type", "application/json");

  request.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("access")
  );
  try {
    request.send(JSON.stringify(jsonData));
  } catch (err) {
    console.log("error2");
  }
}

export function update_info(jsonData, doneUpdate, failedUpdate, retry=3){
  if (retry < 0) {
    return;
  }
  const request = new XMLHttpRequest();
  try {
    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 201) {
          // console.log(request.responseText);
          doneUpdate()
          console.log("ok");
        } else if (request.status === 401) {
          // refresh the token and get my account ONE more time
          // if the refresh token still fails, then log the user out
          console.log("here...")
          refreshAccess(() => {
            update_info(jsonData, doneUpdate, failedUpdate, retry - 1);
          });
        } else {
          failedUpdate()
          console.log(request.response);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  request.open("POST", getSearchUrl("update_info"));
  request.setRequestHeader("Content-Type", "application/json");

  request.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("access")
  );
  try {
    request.send(JSON.stringify(jsonData));
  } catch (err) {
    console.log("error2");
  }
}


// retry is for handling a weird error where the serevr return a 200 even though
// it can't refresh the refresh token, unable to reproduce the error
export function submit_Notify(jsonData, retry = 3) {
  if (retry < 0) {
    return;
  }
  const request = new XMLHttpRequest();
  try {
    request.addEventListener("readystatechange", () => {
      // in async request, ready state 4 is when the request is fully done
      // look at xml readystatechange for what each code means
      
      if (request.readyState === 4) {
        if (request.status === 200 || request.status === 201) {
          // console.log(request.responseText);
          console.log("ok");
        } else if (request.status === 401) {
          // refresh the token and get my account ONE more time
          // if the refresh token still fails, then log the user out
          refreshAccess(() => {
            submit_Notify(jsonData, retry - 1);
          });
        } else {
          console.log("error fetching account page...");
          console.log(request.response);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  request.open("POST", getSearchUrl("notify"));
  request.setRequestHeader("Content-Type", "application/json");

  request.setRequestHeader(
    "Authorization",
    "Bearer " + localStorage.getItem("access")
  );
  try {
    // console.log(jsonData)
    request.send(JSON.stringify(jsonData));
  } catch (err) {
    console.log("error2");
  }
}

export function passwordRequirmentCheck(password){

  const lenCheck = /^.{10,20}$/;
  const upperCase = /[A-Z]+/;
  const digit = /[\d]+/;
  const lowerCase = /[a-z]+/;
  const specialChar = /[!@#$]+/;

  return [
    lenCheck.test(password), 
    upperCase.test(password), 
    lowerCase.test(password),
    digit.test(password),
    specialChar.test(password)
  ]
}

export function logout() {
  const request = new XMLHttpRequest();
  request.addEventListener("readystatechange", () => {
    // in async request, ready state 4 is when the request is fully done
    // look at xml readystatechange for what each code means
    if (request.readyState === 4) {
      store.dispatch(updateLoginStatus({ key: "loginStatus", value: false }));
      // store.dispatch(updateLoginStatus({ key: "expiredAuth", value: true }));
      localStorage.removeItem("refresh");
      localStorage.removeItem("access");
    }
  });

  request.open("POST", getSearchUrl("refresh"));
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({ refresh: localStorage.getItem("refresh") }));
}

export function signup(email, username, password, onErrorCallback) {
  const request = new XMLHttpRequest();
  request.addEventListener("readystatechange", () => {
    // in async request, ready state 4 is when the request is fully done
    // look at xml readystatechange for what each code means
    if (request.readyState === 4) {
      console.log(request.responseText);

      if (request.status === 400) {
        onErrorCallback(false, request.responseText);
      } else {
        onErrorCallback(true, request.responseText);
      }
    }
  });

  request.open("POST", getSearchUrl("signup"));
  request.setRequestHeader("Content-Type", "application/json");
  console.log(
    JSON.stringify({ email: email, username: username, password: password })
  );
  request.send(
    JSON.stringify({ email: email, username: username, password: password })
  );
}

function helperRetry(func = null, retry) {
  if (retry > 0) func(retry);
}

export function mainRetry(retry = 5) {
  console.log("retry: ", retry);
  helperRetry(mainRetry, retry - 1);
}
