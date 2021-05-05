class CodioAPI {
  load = () => {
    var ret = Q.defer();
    if (window.codio) {
      window.codio.loaded()
        .then(() => {
          ret.resolve(this);
        });
    } else {
      ret.reject("No Codio loaded");
    }
    return ret.promise;
  }

  // promise
  getFile = () => {
    const fileName = window.codio.getFileName();
    return window.codio.getFile(fileName);
  }

  saveFile = (content) => {
    const fileName = window.codio.getFileName();
    return window.codio.saveFile(fileName, content);
  }

  subscribeChanges = func => {
    window.codio.subscribe('hasChanges', func);
  }

  getFileName = () => {
    return window.codio.getFileName();
  }

  createNewFile = (parentFolderId, fileName) => {
    var reqOpts = {
      'path': '/drive/v3/files',
      'method': 'POST',
      'body': {
        'parents': [parentFolderId],
        'mimeType': 'text/plain',
        'name': fileName
      }
    };
    return window.gapi.client.request(reqOpts);
  }

  getAppDataFileID = (appDataFilename) => {
    return window.gapi.client.drive.files.list({
      q: 'not trashed and name="' + appDataFilename + '"',
      spaces: 'appDataFolder'
    });
  }

  createAppDataFile = (appDataFilename) => {
    return window.gapi.client.drive.files.create({
      resource: {
        name: appDataFilename,
        parents: ['appDataFolder']
      }
    });
  }

  getAppDataFileContent = (fileId) => {
    return window.gapi.client.drive.files.get({
      fileId: fileId,
      // Download a file — files.get with alt=media file resource
      alt: 'media'
    });
  }

  saveAppData = (fileId, appData) => {
    return window.gapi.client.drive.files.update({
      path: '/upload/drive/v3/files/' + fileId,
      method: 'PATCH',
      params: {
        uploadType: 'media'
      },
      body: JSON.stringify(appData)
    });
  }

  // Create and render a Google Picker object for selecting a file.
  createPicker = (appName, callback) => {
    window.gapi.load('picker', () => {
      this.getAppFolderID(appName).then((resp) => {
        var driveView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS).setIncludeFolders(true);
        if(resp.result.files.length !== 0) {
          driveView.setParent(resp.result.files[0].id);
        }
        window.picker = new window.google.picker.PickerBuilder()
          .setTitle("Select a Pyret document")
          .addView(driveView)
          .setOAuthToken(window.gapi.auth.getToken().access_token)
          .setCallback(callback)
          .setOrigin(window.location.protocol + '//' + window.location.host)
          .build();

        window.picker.setVisible(true);
      })
    });
  }
};

export default CodioAPI();