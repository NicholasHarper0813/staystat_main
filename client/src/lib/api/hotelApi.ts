import axios from "@/utils/axios";
import { HotelData } from "@/lib/Types/Dashboard/types";
export function hotelApi(): Promise<{ data: HotelData }> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get("/data/hotels");
      const data = await response.data;
      resolve({ data });
    } catch (error) {
      console.error("Error fetching booking data: ", error);
      reject(error);
    }
  });
}
