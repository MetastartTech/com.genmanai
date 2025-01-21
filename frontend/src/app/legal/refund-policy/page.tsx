import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen overflow-y-scroll overflow-x-hidden scrollbar scrollbar-none font-opensans">
      {/* <Header /> */}
      <div className="p-4 max-w-screen-lg mx-auto mb-4">
        <h2 className="text-2xl font-bold my-4">Refund Policy</h2>
        <p className="text-right">Last Updated: {new Date().toDateString()}</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">All Sales Are Final</h3>
        <p className="my-2">
          Please carefully review your order before confirming your purchase.
          All sales are considered final. We do not offer refunds or exchanges
          for any products or services sold through https://www.genmanai.com/
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          Non-Refundable Items or Services
        </h3>
        <p className="my-2">
          All items or services purchased from GenmanAI are non-refundable
          unless otherwise specified in writing by GenmanAI. This policy applies
          but is not limited to:
        </p>
        <ul className="list-disc pl-8 my-2">
          <li>Digital Products</li>
          <li>Software Licenses</li>
          <li>Subscription Services</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          Exceptions to the No Refund Policy
        </h3>
        <p className="my-2">
          The only exceptions to our No Refund Policy include:
        </p>
        <ul className="list-disc pl-8 my-2">
          <li>
            Incomplete Service: If a purchased service is not fully delivered or
            does not meet the predefined criteria as advertised, a partial or
            full refund may be considered.
          </li>
          <li>
            Legal Requirements: Following applicable laws, any other conditions
            or circumstances where we are legally required to offer a refund
            will be honored.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">How to Contact Us</h3>
        <p className="my-2">
          For any questions or concerns regarding this No Refund Policy, please
          contact us at:
        </p>
        <p className="my-2">
          Email:{" "}
          <a
            href="mailto:hi@genmanai.com"
            className="text-blue-500 hover:text-blue-600"
          >
            hi@genmanai.com
          </a>
        </p>
        <p className="my-2">
          Phone:{" "}
          <a
            href="tel:+919538030505"
            className="text-blue-500 hover:text-blue-600"
          >
            +91 9538030505
          </a>{" "}
          <a
            href="tel:+917760615068"
            className="text-blue-500 hover:text-blue-600"
          >
            +91 7760615068
          </a>
        </p>

        <p className="my-2">
          We reserve the right to modify this No Refund Policy at any time,
          effective upon posting of an updated version on our website. Please
          regularly check https://www.genmanai.com/ for updates.
        </p>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default RefundPolicy;
