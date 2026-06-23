import {
  ApplePay,
  GooglePay,
  CreditCard,
  PaymentForm,
} from "react-square-web-payments-sdk";

import { supabase } from "../../supabase";

function PaymentHandler(amount: string) {
  const squareAppId = import.meta.env.VITE_SQUARE_APP_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  return (
    <PaymentForm
      locationId={locationId}
      applicationId={squareAppId}
      cardTokenizeResponseReceived={(token, buyer) => {
        console.info({ token, buyer });
        supabase.functions
          .invoke("square-api", {
            body: {
              name: "Functions",
              amount: amount,
              sourceId: token,
            },
          })
          .then((data) => console.log(data))
          .catch((error) => console.error(error));
      }}
      createPaymentRequest={() => ({
        countryCode: "AU",
        currencyCode: "AUD",
        total: {
          amount: amount,
          label: "Total",
        },
      })}
    >
      <ApplePay />
      <GooglePay />
      <CreditCard />
    </PaymentForm>
  );
}

export default PaymentHandler;
