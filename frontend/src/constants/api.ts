const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/v1/api";

const USER_API = {
  SIGNIN: API_BASE_URL + "/user",
  SIGNUP: API_BASE_URL + "/user/signup",
  SIGNUP_EMAIL: API_BASE_URL + "/user/signupEmail",
  SIGNIN_EMAIL: API_BASE_URL + "/user/signinEmail",
  TRIAL: API_BASE_URL + "/user/trial",
};

const LLM_REQUEST_API = {
  REQUESTS: API_BASE_URL + "/request",
  COMPLETION: API_BASE_URL + "/request/completion",
  CHAT: API_BASE_URL + "/request/chat",
  COMPARE: API_BASE_URL + "/request/compare",
};

const FOLDER_API = {
  ADD: API_BASE_URL + "/folder",
};

const IMAGE_API = {
  REQUESTS: API_BASE_URL + "/image",
  GENERATION: API_BASE_URL + "/image/generation",
  COMPARE: API_BASE_URL + "/image/compare",
};

const REFERRAL_API = {
  CHECK: API_BASE_URL + "/referral/check",
};

const HISTORY_API = {
  GET: API_BASE_URL + "/log",
};

const PLAN_API = {
  GET: API_BASE_URL + "/plan",
};

const STRIPE_API = {
  CHECKOUT: API_BASE_URL + "/stripe/checkout",
  MANAGE: API_BASE_URL + "/stripe/manage",
};

const RAZORPAY_API = {
  CREATE_ORDER: API_BASE_URL + "/razorpay/create-order",
  VERIFY_PAYMENT: API_BASE_URL + "/razorpay/verify-payments",
  // MANAGE: API_BASE_URL + "/stripe/manage",
};

const FEEDBACK_API = {
  ADD: API_BASE_URL + "/feedback",
};

export default API_BASE_URL;
export {
  USER_API,
  LLM_REQUEST_API,
  FOLDER_API,
  IMAGE_API,
  REFERRAL_API,
  HISTORY_API,
  PLAN_API,
  STRIPE_API,
  FEEDBACK_API,
  RAZORPAY_API,
};
