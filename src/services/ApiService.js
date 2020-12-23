import Api from '../utils/Api';

const prefixUri = 'api/';

class ApiService {
  get(url, config) {
    return Api.get(prefixUri + url, config);
  }

  post(url, data, config) {
    return Api.post(prefixUri + url, data, config);
  }

  delete(url, config) {
    return Api.delete(prefixUri + url, config);
  }

  put(url, data, config) {
    return Api.put(prefixUri + url, data, config);
  }

  patch(url, data, config) {
    return Api.patch(prefixUri + url, data, config);
  }
}

export default new ApiService();
