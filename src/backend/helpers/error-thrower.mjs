
export default {
  notLoggedIn: () => {
    let error = new Error('Access denied, not logged in Backend');
    error.status = 401;
    throw error;
  },
  notCorrectEthereumAddress: () => {
    let error = new Error('Access denied, provided ethereum-address does not match owner-address');
    error.status = 403;
    throw error;
  },
  noEntryFoundById: (id) => {
    let error;

    if(id) {
      error = new Error('Could not find the entry with the provided ID: ' + id);
    } else {
      error= new Error('Could not find the entry with the provided ID');
    }
    error.status = 400;
    throw error;
  },

  noCreationOfEntry: (entryObject) => {
    let error;
    if(entryObject) {
      error = new Error('Could not create an entry in the DB: ' + entryObject);
    } else {
      error = new Error('Could not create an entry in the DB');
    }
    error.status = 500;
    throw error;
  },

  missingParameter: (param) => {
    let error = new Error('Missing parameter was not provided: ' + param);
    error.status = 400;
    throw error;
  },
  missingQueryParameter: (queryparam) => {
    let error = new Error('Missing Query parameter was not provided: ' + queryparam);
    error.status = 400;
    throw error;
  },
  missingBodyValue: (value) => {
    let error = new Error('Missing body-value was not provided: ' + value);
    error.status = 400;
    throw error;
  },
  internalError: (message) => {
    let error = new Error(message);
    error.status = 500;
    throw error;
  },
  notCorrectStatus: (expectedStatus, foundStatus) => {
    let error = new Error('The status found is not as expected. Expected Status: '
      + expectedStatus + '. Status found: ' + foundStatus);
    error.status = 400;
    throw error;
  }


}