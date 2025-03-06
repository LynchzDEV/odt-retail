import { Elysia, t } from "elysia";
import { HomePage } from "../pages/HomePage";
import { ConfirmOrderPage } from "../pages/ConfirmOrderPage";
import { PaymentPage } from "../pages/PaymentPage";
import { SuccessPage } from "../pages/SuccessPage";
import { addOrder } from "../store";
import { sendOrderConfirmationEmail } from "../services/emailService";

const orderBodySchema = t.Object({
  productId: t.String(),
  quantity: t.String(),
  totalAmount: t.String(),
  customerName: t.String(),
  customerEmail: t.String(),
});

export const routes = new Elysia()
  .get("/", () => HomePage())

  .post(
    "/confirm-order",
    ({ body }) =>
      ConfirmOrderPage({
        productId: Number(body.productId),
        quantity: Number(body.quantity),
      }),
    {
      body: t.Object({
        productId: t.String(),
        quantity: t.String(),
      }),
    }
  )

  .post(
    "/process-order",
    ({ body, set }) => {
      try {
        const productId = Number(body.productId);
        const quantity = Number(body.quantity);
        const totalAmount = Number(body.totalAmount);

        const order = addOrder({
          products: [{ productId, quantity }],
          totalAmount,
          customerName: body.customerName,
          customerEmail: body.customerEmail,
        });

        return PaymentPage({
          orderData: {
            orderId: order.id,
            productId,
            quantity,
            totalAmount,
            customerName: body.customerName,
            customerEmail: body.customerEmail,
          },
        });
      } catch (error) {
        console.error("Error processing order:", error);
        set.status = 500;
        return {
          error:
            "There was an error processing your order. Please contact support.",
        };
      }
    },
    { body: orderBodySchema }
  )

  .post(
    "/success",
    async ({ body }) => {
      const {
        orderId,
        productId,
        quantity,
        totalAmount,
        customerName,
        customerEmail,
      } = body;
      let emailSent = false;

      try {
        emailSent = await sendOrderConfirmationEmail(
          orderId,
          customerName,
          customerEmail,
          Number(totalAmount),
          [{ productId: Number(productId), quantity: Number(quantity) }]
        );
      } catch (error) {
        console.error("Error sending email:", error);
      }

      return SuccessPage({
        orderId,
        productId: Number(productId),
        quantity: Number(quantity),
        totalAmount: Number(totalAmount),
        customerName,
        customerEmail,
        emailSent,
      });
    },
    {
      body: t.Object({
        ...orderBodySchema.properties,
        orderId: t.String(),
      }),
    }
  );
