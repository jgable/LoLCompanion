/**
 * @providesModule backbone-sync-fetch
 */

 var Backbone = require('backbone');
 var _ = require('lodash');
 var fetch = require('fetch');

 var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

 Backbone.sync = function backboneFetchSync(method, model, options) {
  options = options || {};
  var type = methodMap[method];

  var params = {
    method: type
  };
  
  if (!options.url) {
    options.url = _.result(model, 'url') || new Error('Must provide a url for model');
  }

  if (type !== 'GET') {
    if (!options.headers) {
      options.headers = new Headers();
      options.headers.append('Content-Type', 'application/json');
    }

    params.headers = options.headers;
    params.body = JSON.stringify(options.body || model.toJSON(options));  
  }

  var xhr = options.xhr = fetch(options.url, params)
    .then(function (response) {
      return response.json();
    })
    .catch(function (err) {
      if (options.error) {
        options.error.apply(this, err, xhr);
      }
    })
    .then(function (responseData) {
      if (options.success) {
        options.success.apply(this, [responseData]);
      }

      return responseData;
    });

  model.trigger('request', model, xhr, options);

  return xhr;
 };

 module.exports = Backbone.sync;
