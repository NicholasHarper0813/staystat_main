import axios from "@/utils/axios";
import { BookingData } from "@/lib/Types/Dashboard/types";
export function bookingApi(): Promise<{ data: BookingData }> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get("/data/bookings");
      const data = await response.data;
      resolve({ data });
    } catch (error) {
      console.error("Error fetching booking data: ", error);
      reject(error);
    }
  });
}
