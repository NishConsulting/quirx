import _ from 'lodash';

const get = function (url, query) {
  return new Promise(function (fulfill, reject) {
    const request = new XMLHttpRequest();
    request.open('GET', encodeURI(url), true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        fulfill(JSON.parse(request.responseText));
      } else {
        reject();
      }
    };
    request.send(query);
  });
};


/*
function randInt(i) { return Math.round(Math.random() * i); }
let stubs = {
  date() {
    return _.times(randInt(100), function (i) {
      return {term: 15000 + i, count: randInt(1e3)};
    });
  },
  weight() {
    return _.times(randInt(100), function (i) {
      return {term: 100 + i, count: randInt(1e3)};
    });
  },
  sex() {
    return _.times(3, function (i) {
      return {term: i, count: randInt(1e3)};
    });
  }
};
*/

const toQueryString = function (object) {
  return _.transform(object, function (result, value, key) {
    result.push(`${key}=${value}`);
  }, []).join('&');
};

const api = {
  events(query) {
    return get(`${API_URL}/events.json?${toQueryString(query)}`);
    // return new Promise(function (fulfill) {
    //   fulfill({
    //     events: stubs[count]()
    //   });
    // });
  }
};

export default api;
