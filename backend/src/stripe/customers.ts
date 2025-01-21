import stripe from "../config/stripe";

const getStripeCustomer = async (email: string) => {
  try {
    const customers = await stripe.customers.list({
      email,
    });
    let customer;
    if (customers.data.length === 0) {
      customer = await stripe.customers.create({
        email,
        name: email,
      });
    } else {
      customer = customers.data[0];
    }
    return customer;
  } catch (error) {
    throw error;
  }
};

export default getStripeCustomer;
