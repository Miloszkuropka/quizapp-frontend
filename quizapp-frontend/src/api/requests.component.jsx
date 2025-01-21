
import { ACCESS_TOKEN } from "../constants"
async function runRequest(url, options, success_callback = (response, data) => {}, fail_callback = (response) => {}) {
  console.log("Nagłówki wysyłanego zapytania:", options.headers);  //CO W NAGLOWKACH

  const response = await fetch(url, options);
  console.log("Odpowiedź z serwera:", response);  // Zobaczmy, co zwraca serwer
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Błąd z serwera:", errorData);
  }
  if (response.ok) {
      const data = await response.json();
      success_callback(response, data);
  } else {
      console.error("Błąd w odpowiedzi:", response);
      fail_callback(response);
  }
}


export async function post(url, body, success_callback = (response, data) => {}, fail_callback = (response) => {}, token = null) {
  //const token = localStorage.getItem(ACCESS_TOKEN);  // Token pobierany bezpośrednio z localStorage
  console.log("CO W BODY: ", JSON.stringify(body, null, 2));
  console.log(token)
  const options = {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
      },
  };
  //to nie wiadomo czy dziala na dole 
  if (token != null) {
    options.headers["Authorization"] = "Bearer " + token;  
  }

  await runRequest(url, options, success_callback, fail_callback);
}


export async function get(url, success_callback = (response, data) => {}, fail_callback = (response) => {}, token = null) {
  const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
  };

  if (token != null) {
      options.headers["Authorization"] = "Bearer " + token;
  }

  // Logowanie URL przed wykonaniem zapytania
  console.log("Making GET request to URL:", url);

  try {
      const response = await fetch(url, options);

      if (response.ok) {
          const data = await response.json();
          success_callback(response, data);
      } else {
          fail_callback(response);
      }
  } catch (error) {
      console.error("Error during fetch:", error);
      fail_callback({ status: "Network Error", message: error.message });
  }
}

export async function post1(
  url, 
  body, 
  success_callback = (response, data) => {}, 
  fail_callback = (response) => {}
) {
  console.log("CO W BODY: ", JSON.stringify(body, null, 2));

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
  };

  await runRequest(url, options, success_callback, fail_callback);
}