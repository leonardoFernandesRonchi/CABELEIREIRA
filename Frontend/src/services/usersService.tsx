import { apiClient } from "./apiClient";

const register = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/users", {
    username,
    email,
    password,
  });

  return response;
};

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/users/signIn", {
    email,
    password,
  });

  return response;
};

const fetchUser = async () => {
  const response = await apiClient.get("/users/me");
  return response;
};

const logOut = async () => {
  await apiClient.delete("/users/logout");
};

export default {
  login,
  register,
  fetchUser,
  logOut,
};
