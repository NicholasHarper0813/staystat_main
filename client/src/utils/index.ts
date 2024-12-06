import axios from "./axios";

export const fetchOwner = async (id: any) => {
  let user = JSON.parse(localStorage.getItem("user") || "").toString();
  console.log(user, "fetchUser");
  try {
    let { data } = await axios.post("/user/fetch-user", {
      id: id || user._id,
    });
    // console.log("===================", data);
    return data.user;
  } catch (error) {
    console.log(error);
  }
};
