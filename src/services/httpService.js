import axios from "axios";
import { toast } from "react-toastify";
import logger from "./LogService";

axios.interceptors.response.use(null, (error) => {
  const er = error.response;
  const expectedError = er && er.status >= 400 && er.status < 500;

  if (!expectedError) {
    logger.log(error);
    toast.error("unexpected error occurred");
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
