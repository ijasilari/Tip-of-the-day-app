export const getUsers = async () => {
  const res = await fetch(
    `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/getusers`
  );
  return await res.json();
};

export const signUpUser = async ({ username, email, password }) => {
  const res = await fetch(
    `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/signup`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        role: "guest",
      }),
    }
  );
  return await res.json();
};

export const loginUser = async ({ email, password }) => {
  const res = await fetch(
    `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/login`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  return await res.json();
};
