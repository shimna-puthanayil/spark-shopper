import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLazyQuery } from "@apollo/client";
import { QUERY_CHECKOUT } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
import CartItem from "../CartItem";
import Auth from "../../utils/auth";
import { useStoreContext } from "../../utils/GlobalState";
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";

import {
  Stack,
  Box,
  Heading,
  Flex,
  HStack,
  Link,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const Cart = () => {
  const [state, dispatch] = useStoreContext();
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise("cart", "get");
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
    }

    if (!state.cart.length) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];

    state.cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  // if (!state.cartOpen) {
  //   return (
  //     <div className="cart-closed" onClick={toggleCart}>
  //       <span role="img" aria-label="trash">
  //         🛒
  //       </span>
  //     </div>
  //   );
  // }
  if (state.cartOpen) {
    let totalQuantity = 0;
    {
      state.cart.map(
        (item) => (totalQuantity = totalQuantity + item.purchaseQuantity)
      );
    }

    return (
      <>
        <Drawer
          isOpen={onOpen}
          placement="right"
          onClose={onclose}
          size={"lg"}
          bgColor={"#51636C"}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton
              m={2}
              onClick={toggleCart}
              color="yellow.300"
              fontWeight="extrabold"
            />
            <DrawerHeader bgColor={"#51636C"}>
              <Heading
                fontSize="xl"
                fontWeight="extrabold"
                bgGradient="linear(to-r,yellow.400, orange.200, yellow.400)"
                bgClip="text"
              >
                Shopping Cart ({totalQuantity} items)
              </Heading>
            </DrawerHeader>

            <DrawerBody>
              <Box
                maxW={{ base: "2xl", lg: "2xl" }}
                mx="auto"
                zIndex={4}
                overflow={"auto"}
                bgColor={"white"}
              >
                <VStack
                  direction={{ base: "column", lg: "row" }}
                  align={{ lg: "flex-start" }}
                  spacing={{ base: "8", md: "16" }}
                  zIndex={3}
                >
                  <Stack spacing={{ base: "8", md: "10" }} flex="2">
                    <Stack spacing="40">
                      {state.cart.length ? (
                        <Box>
                          {state.cart.map((item) => (
                            <CartItem key={item._id} item={item} />
                          ))}
                          <Box>
                            <HStack>
                              <Text w={480} fontWeight={"bold"}>
                                Total:
                              </Text>
                              <Text fontWeight={"bold"} align="right">
                                ${calculateTotal()}
                              </Text>
                            </HStack>

                            {Auth.loggedIn() ? (
                              <Button
                                mt={10}
                                p={2}
                                colorScheme="black"
                                type="submit"
                                bgColor="#495C62"
                                borderRadius="full"
                                _hover={{
                                  bg: "gray.700",
                                }}
                                width={{
                                  base: "150px",
                                  md: "200px",
                                  lg: "250px",
                                }}
                                align={"center"}
                                onClick={submitCheckout}
                              >
                                Checkout
                              </Button>
                            ) : (
                              <Flex direction="column" align="left" flex="1">
                                <HStack mt="6" fontWeight="semibold">
                                  <Link>Log in to check out</Link>
                                  <p>or</p>
                                  <Link color={"black"}>Continue shopping</Link>
                                </HStack>
                              </Flex>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Heading>
                          <Text>😱</Text>
                          You haven't added anything to your cart yet!
                        </Heading>
                      )}
                    </Stack>
                  </Stack>
                </VStack>
              </Box>
            </DrawerBody>

            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
};

export default Cart;