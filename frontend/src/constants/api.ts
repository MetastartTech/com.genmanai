const API_BASE_URL = "http://localhost:8080/v1/api";

const USER_API = {
  SIGNIN: API_BASE_URL + "/user/",
  SIGNUP: API_BASE_URL + "/user/signup",
};

const LLM_REQUEST_API = {
  REQUESTS_API: API_BASE_URL + "/request",
  COMPLETION: API_BASE_URL + "/request/completion",
  CHAT: API_BASE_URL + "/request/chat",
};

export default API_BASE_URL;
export { USER_API, LLM_REQUEST_API };
