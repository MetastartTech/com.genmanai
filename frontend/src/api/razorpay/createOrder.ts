import { RAZORPAY_API } from "@/constants/api";

export const createOrder = async (idToken: string, options: any) => {
  try {
    const response = await fetch(RAZORPAY_API.CREATE_ORDER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add this line
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (response.status !== 200) {
      // Provide a more informative error message
      throw new Error(
        `Failed to create order: ${data.message || "Unknown error"}`
      );
    }

    return data;
  } catch (error) {
    // Log the error or handle it as needed
    console.error("Error creating Razorpay order:", error);
    throw error; // Rethrow the error if you want the caller to handle it
  }
};
