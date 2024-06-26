import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
// import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  // useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/orderApiSlice";
import axios from 'axios';

const OrderScreen = () => {


  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const handlePayment = async () => {
    try {
      const amount = parseInt(order?.totalPrice);
      const orderResponse = await axios.post(`/api/payment/checkout`, { order });
      const ordrid = order._id;
      console.log(orderResponse);
      const options = {
        key: "rzp_test_m8mkcKrmzK0IXv",
        amount: amount * 100,
        currency: "INR",
        name: "Shivang Kacha",
        description: "Test Transaction",
        image: "",
        order_id: orderResponse.id,
        // callback_url: "http://localhost:5000/api/payment/paymentverification",
        handler: function (response) {
          const paymentData = {
            paymentId: response.razorpay_payment_id,
            orderID: response.razorpay_order_id,
            signature: response.razorpay_signature,
            order_Id: order._id
          }
          onApprove();

        },
        prefill: {
          name: "Shivang Kacha",
          email: "shivangkachasbk9@gmail.com",
          contact: "8160004051"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#000000"
        }
      };
      var razor = new window.Razorpay(options);
      razor.open();

    }
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { isPending } = { isPending: false };
  // const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // const {
  //   data: paypal,
  //   isLoading: loadingPayPal,
  //   error: errorPayPal,
  // } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!errorPayPal && !loadingPayPal && paypal.clientId) {
  //     const loadPaypalScript = async () => {
  //       paypalDispatch({
  //         type: "resetOptions",
  //         value: {
  //           "client-id": paypal.clientId,
  //           currency: "USD",
  //         },
  //       });
  //       paypalDispatch({ type: "setLoadingStatus", value: "pending" });
  //     };
  //     if (order && !order.isPaid) {
  //       if (!window.paypal) {
  //         loadPaypalScript();
  //       }
  //     }
  //   }
  // }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  async function onApprove(data, actions) {
    const ordrid = order?._id;
    console.log(ordrid);
    try {
      await payOrder({ ordrid });
      refetch();
      toast.success("Order is paid");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }

  }

  async function onPaid(ordrid, data) {
    try {
      await payOrder({});
      refetch();
      toast.success("Order is paid");
    }
    catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success("Order is paid");
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered!");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        style={{ marginBottom: "10px" }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button> */}

                      <div>
                        <Button
                          type="submit"
                          variant="contained"
                          style={{
                            alignItems: "center",
                            padding: "10px 20px",
                            borderRadius: "20px",
                            backgroundColor: "#b79cc5",
                            color: "#fff",
                          }}
                          onClick={handlePayment}
                        >
                          Pay
                        </Button>
                        {/* <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons> */}
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;