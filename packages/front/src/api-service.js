export default class APIService {
  constructor(baseURL = "/") {
    this.baseURL = baseURL;
  }

  get(relativeURL, options = {}) {
    return this.request(relativeURL, {
      method: "GET",
      responseType: options.responseType,
      searchParams: options.searchParams,
    });
  }

  post(relativeURL, body, options = {}) {
    return this.request(relativeURL, {
      method: "POST",
      responseType: options.responseType,
      searchParams: options.searchParams,
      body,
    });
  }

  put(relativeURL, body, options = {}) {
    return this.request(relativeURL, {
      method: "PUT",
      responseType: options.responseType,
      searchParams: options.searchParams,
      body,
    });
  }

  delete(relativeURL, options = {}) {
    return this.request(relativeURL, {
      method: "DELETE",
      responseType: options.responseType,
      searchParams: options.searchParams,
    });
  }

  async request(relativeURL, options) {
    const { method, body, searchParams } = options;

    const defaultResponseType = "json";
    const responseType = options.responseType || defaultResponseType;

    const requestURL = this.getRequestURL(relativeURL, searchParams);

    try {
      const response = await fetch(requestURL, {
        method,
        credentials: "same-origin",
        headers: generateHeaders(),
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) throw Error(await getErrorMessage(response));

      /* обработка данных */
      if (responseType === "no-content") return undefined;
      return response[responseType]();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getRequestURL(relativeURL, searchParams = {}) {
    const search = getSearchSuffix(searchParams);

    /* start 
    Все подряд идущие слэши в URL заменяются на один кроме спаренных слэшей после протокола - http://
    Сделано таким старым способом, чтобы поддерживалось во всех браузерах, включая FireFox

    Пример: 
      const URL = "http://my-path.org//someinfo///testing/hah//jjj////j"
      URL.replace(/(https?:\/\/)|(\/)+/g, '$1$2')
      console.log(URL) покажет "http://my-path.org/someinfo/testing/hah/jjj/j"
    */
    const regExp = /(https?:\/\/)|(\/)+/g;
    const combinedURL = `${this.baseURL}${relativeURL}`.replace(regExp, "$1$2");
    /* end Убираем лишние слэши в URL */

    return `${combinedURL}${search}`;
  }
}

// #region utils
function getSearchSuffix(searchParams) {
  const searchKeys = Object.keys(searchParams);
  if (searchKeys.length === 0) return "";

  const usp = new URLSearchParams();
  searchKeys.forEach(key => {
    usp.append(key, searchParams[key].toString());
  });

  return `?${usp.toString()}`;
}

function generateHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

async function getErrorMessage(response) {
  try {
    const isClientError = response.status >= 400 && response.status < 500;
    const commonMessage = `Ошибка ${response.status} ${response.statusText}`;

    if (!isClientError) return commonMessage;

    const errorBody = await response.json();
    return errorBody.message || commonMessage;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
// #endregion
