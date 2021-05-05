// Defines storageAPI (as a promise) for others to use
var storageAPIDeferred = Q.defer();
var sheetsAPIDeferred = Q.defer();
window.storageAPI = storageAPIDeferred.promise;
window.sheetsAPI = sheetsAPIDeferred.promise;
window.isCodio = document.location.hash.replace('#', '') === "codio";

window.handleClientLoad = function handleClientLoad(apiKey) {
  const defer = Q.defer();
  var api = defer.promise;
  defer.reject(new Error("inside Codio"));
  if (!isCodio) {
    gapi.client.setApiKey(apiKey);
    api = createProgramCollectionAPI("code.pyret.org", true);
  }

  api.then(function(api) {
    storageAPIDeferred.resolve(api);
    var sheetsApi = createSheetsAPI(true);
    sheetsApi.then(function(sheetsAPI) {
      sheetsAPIDeferred.resolve(sheetsAPI);
    });
    sheetsApi.fail(function(err) {
      sheetsAPIDeferred.reject(err);
    });
  });
  api.fail(function(err) {
    storageAPIDeferred.reject(err);
    sheetsAPIDeferred.reject(err);
    console.log("Not logged in; proceeding without login info", err);
  });
}
