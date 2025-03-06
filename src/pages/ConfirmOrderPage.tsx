import { Layout } from "../components/Layout";
import { getProductById } from "../store";

interface ConfirmOrderPageProps {
  productId: number;
  quantity: number;
}

export const ConfirmOrderPage = ({
  productId,
  quantity,
}: ConfirmOrderPageProps) => {
  const product = getProductById(productId);

  if (!product) {
    return (
      <Layout title="Error">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-red-500">Product not found</h1>
          <a href="/" class="text-blue-500 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </Layout>
    );
  }

  const totalAmount = product.price * quantity;

  return (
    <Layout title="Confirm Order">
      <div class="max-w-md mx-auto">
        <h1 class="text-3xl font-bold mb-6">Confirm Your Order</h1>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="mb-4">
            <h2 class="text-xl font-semibold">{product.name}</h2>
            <p class="text-gray-600">{product.description}</p>
            <p class="mt-2">
              Price: ${product.price.toFixed(2)} x {quantity}
            </p>
            <p class="font-bold mt-2">Total: ${totalAmount.toFixed(2)}</p>
          </div>

          {/* Changed the form action to /process-order instead of /success */}
          <form hx-post="/process-order" hx-swap="innerHTML" hx-target="body">
            <input type="hidden" name="productId" value={String(productId)} />
            <input type="hidden" name="quantity" value={String(quantity)} />
            <input
              type="hidden"
              name="totalAmount"
              value={String(totalAmount)}
            />

            <div class="mb-4">
              <label class="block text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="customerName"
                required
                class="w-full px-3 py-2 border rounded"
              />
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="customerEmail"
                required
                class="w-full px-3 py-2 border rounded"
              />
            </div>

            <div class="flex justify-between">
              <a
                href="/"
                class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </a>
              <button
                type="submit"
                class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Confirm Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
