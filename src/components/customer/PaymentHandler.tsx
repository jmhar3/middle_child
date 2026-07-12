import { useState } from "react";

import {
  Accordion,
  Divider,
  Flex,
  Loader,
  Modal,
  Stack,
  Text,
} from "@mantine/core";

import {
  GooglePay,
  CreditCard,
  PaymentForm,
} from "react-square-web-payments-sdk";

import { supabase } from "../../supabase";
import OrderSummary from "./OrderSummary";

import type { PendingOrderType } from "../../state/types";

interface PaymentHandlerProps {
  userId: string;
  order: PendingOrderType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: (error?: string) => void;
}

function PaymentHandler(props: PaymentHandlerProps) {
  const { userId, order, isOpen, onClose, onSuccess, onFailure } = props;

  const squareAppId = import.meta.env.VITE_SQUARE_APP_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  console.log("squareAppId: ", squareAppId);
  console.log("locationId: ", locationId);

  const [tokenSuccess, setTokenSuccess] = useState(false);

  const placeOrder = (token: string) => {
    supabase.functions
      .invoke("square-api", {
        body: {
          name: "Functions",
          sourceId: token,
          userId: userId,
          dueAt: order.due_at,
          total: order.total,
          note: order.note,
          orderItems: order.items.map((item) => ({
            is_large: item.is_large,
            menuItemId: item.item.id,
            quantity: item.quantity,
            note: item.note,
            modifiers: item.modifiers?.map((modifier) => modifier.id),
          })),
        },
      })
      .then((data) => {
        if (data.data === "ok") {
          onSuccess();
        } else {
          console.error(data.error);
          onFailure(data.error);
        }
      })
      .catch((error: string) => onFailure(error));
  };

  return (
    <Modal
      fullScreen
      opened={isOpen}
      onClose={onClose}
      title="Pay securely with Square"
    >
      <Stack>
        <Accordion chevronPosition="left" variant="separated">
          <Accordion.Item value={"order_summary"}>
            <Accordion.Control>
              <Flex justify="space-between">
                <Text>Show Order Summary</Text>
                <Text>Total: ${order.total.toFixed(2)}</Text>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel>
              <OrderSummary order={order} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {tokenSuccess ? (
          <Stack align="center">
            <Text size="lg">Please wait while we process your order</Text>
            <Loader color="darkslategray" type="dots" />
          </Stack>
        ) : (
          <PaymentForm
            locationId={locationId}
            applicationId={squareAppId}
            cardTokenizeResponseReceived={(token, buyer) => {
              console.info({ token, buyer });
              if (token.status === "OK") {
                setTokenSuccess(true);
                placeOrder(token.token);
              }
            }}
            createPaymentRequest={() => ({
              countryCode: "AU",
              currencyCode: "AUD",
              total: {
                amount: order.total.toString(),
                label: "Total",
              },
            })}
          >
            <Stack gap="md">
              <Text ta="center">Express Checkout</Text>

              <GooglePay />

              <Divider label="OR" labelPosition="center" />

              <CreditCard includeInputLabels />
            </Stack>
          </PaymentForm>
        )}
      </Stack>
    </Modal>
  );
}

export default PaymentHandler;
