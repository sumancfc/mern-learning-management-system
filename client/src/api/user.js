//create user
export const createUser = async (user) => {
  try {
    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//get users
export const getUsers = async (signal) => {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//get user by id
export const getUserById = async (params, credentials, signal) => {
  try {
    const response = await fetch("/api/user/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//update user
export const updateUser = async (params, credentials, user) => {
  try {
    let response = await fetch("/api/user/" + params.userId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: user,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

//delete User
export const deleteUser = async (params, credentials) => {
  try {
    const response = await fetch("/api/user/" + params.userId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
