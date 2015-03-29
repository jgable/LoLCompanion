/**
 * @providesModule backbone-sync-fetch
 */

var _ = require('lodash');
var fetch = require('fetch');

var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

var throwUrlError = function () {
  var err = new Error('Must provide a url for sync');
  throw err;
};

function backboneFetchSync(method, model, options) {
  options = options || {};
  var type = methodMap[method];

  var params = {
    method: type
  };

  if (!options.url) {
    options.url = _.result(model, 'url') || throwUrlError();
  }

  if (type !== 'GET') {
    if (!options.headers) {
      options.headers = new Headers();
      options.headers.append('Content-Type', 'application/json');
    }

    params.headers = options.headers;
    params.body = JSON.stringify(options.body || model.toJSON(options));
  }

  return new Promise(function (resolve, reject) {
    var xhr = options.xhr = fetch(options.url, params)
      .then(function (response) {
        return response.json();
      })
      .then(function (responseData) {
        if (options.success) {
          options.success.apply(this, [responseData]);
        }

        resolve(responseData);
      }, function (err) {
        if (options.error) {
          options.error.apply(this, err, xhr);
        }

        reject(err);
      });

    model.trigger('request', model, xhr, options);
  });
 }

 module.exports = function (Backbone) {
   Backbone.originalSync = Backbone.sync;
   Backbone.sync = backboneFetchSync;
 };
