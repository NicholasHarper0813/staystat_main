import axios from "@/utils/axios";
export function userApi(): Promise<{ data: any }> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get("/data/users");
      const data = await response.data;
      resolve({ data });
    } catch (error) {
      console.error("Error fetching booking data: ", error);
      reject(error);
    }
  });
}
