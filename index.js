"use strict";

const apiKey = "EaPfXYCBhcSKbRifNB0aiAlnaCyn9q2KXk1w5EJi";
const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  console.log(responseJson);
  if (responseJson.total === "0") {
    $("#results").append(`
        <p class="sorry">I am sorry, we could not find any results to your search.</p>
        `);
  } else {
    for (let i = 0; i < responseJson.data.length; i++) {
      $(".list").append(`
            <li>
            <h3><span>Park Name:</span> ${responseJson.data[i].name}</h3>
            <p><span>States:</span> ${responseJson.data[i].states}</p>
            <p><span>Description:</span> ${responseJson.data[i].description}</p>
            <p><span>Website:</span> <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></p>
            <p><span>Address:</span> ${responseJson.data[i].directionsInfo}  For further information: <a href="${responseJson.data[i].directionsUrl}" target="_blank">Click here.</a></p>
            </li>
        `);
    }
  }

  $("#results").show();
  $("#parks").val("");
}

function getParksList(finalResult, maxResults) {
  const params = {
    api_key: apiKey,
    stateCode: finalResult,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(resonse.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(error => {
      $("#err-js").text(`Something went wrong: ${error.message}`);
    });
}

function validateState() {
  const searchItem = $("#parks").val();
  const maxResults = $("#max-results").val();
  let placeArray = searchItem.split(",");
  const abbreviations = placeArray.map(place => {
    const state = STORE.find(
      ({ name }) => name.toLowerCase().trim() === place.toLowerCase().trim()
    );
    console.log(state);
    const abb = STORE.find(
      ({ abbreviation }) => abbreviation.toLowerCase().trim() === place.toLowerCase().trim()
    );
    console.log(abb);
    if (state) {
      return state.abbreviation;
    } else if (abb) {
      return abb.abbreviation;
    }
  });
  console.log(abbreviations);
  const finalResult = abbreviations.join(",");
  getParksList(finalResult, maxResults);
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    $(".list").empty();
    $(".err-js").empty();
    $("#results").hide();
    $(".sorry").remove();
    validateState();
  });
}

$(function() {
  console.log("App loaded! Waiting for submit!");
  $("#results").hide();
  watchForm();
});
