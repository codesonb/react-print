
const G_apiBaseUrl = `${window.location.hostname}:${window.location.port}/api`;

let jwtToken = window.localStorage.getItem('security-token');
let apiopt = { async: true };

export function setToken(token) { window.localStorage.setItem('security-token', jwtToken=token); }

function fetchApi(method, path, body, headers_in, nonJson)
{
  const base  = G_apiBaseUrl;
  const mode  = 'cors';
  const cache = 'no-cache';
  const headers = Object.assign({'Content-Type': 'application/json'}, headers_in);

  if (jwtToken) headers.Authorization = `Bearer ${jwtToken}`;

  path = 'https://' + `${base}/${path}`.replace(/(^\/|\/{2,})/g, '/');
  if (body) body = JSON.stringify(body);
  let opt = {method, headers, body, mode, cache};
  Object.assign(opt, apiopt);
  return fetch(path, opt)
    .catch(reason => {
      console.error(reason.message);
    })
    .then( async (resp) =>
    {
      if (!resp) return { status: 0, success: false, error: '無法連接伺服器。' };
      switch (resp.status) {
        case 500:
        case 400: return { status: resp.status, success: false, error: await resp.text() };
        case 401: return logout(window.location.href = "/login");
        case 403: window.location.href = "/"; return;
        case 404: throw new Error('Resource is not found');
      }
      if (nonJson) return resp;
      if (200 == resp.status) return await resp.json();
      return resp;
    });
}

export function getApi(path, nonJson) { return fetchApi('GET', path, null, null, nonJson||false); }
export function postApi(path, body, nonJson) { return fetchApi('POST', path, body, null, nonJson||false); }
function putApi(path, body) { return fetchApi('PUT', path, body); }
function deleteApi(path, body) { return fetchApi('DELETE', path, body); }

class ApiController
{
  sync() { apiopt.async = false; }
  async() { apiopt.async = true; }

  //----------------------------------------------------------
  // launch profile functions
  async validateToken()
  {
    // let info = await getApi('validate-token');
    // if (0 === info.status) {
    //   logout();
    //   return false;
    // } else {
    //   setToken(info.token);
    //   setUser(info.name, info.role);
    //   return true;
    // }
  }
  getHomeData() { return getApi('home'); }

  //----------------------------------------------------------
  // REST API

  //----------------------------------------------------------
  get Token() { return jwtToken; }

}

//---------------------------------------------------------------------------
const API = new ApiController();
let ApiReady;

if (jwtToken) {
  ApiReady = Promise.all([
    API.validateToken(),
    API.getHomeData().then(data => {
      Object.freeze(window.DATA = data);
    }),
  ]);
} else {
  ApiReady = (async () => false)();
}

export { ApiReady, API };
export default API;
