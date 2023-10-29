import { Link } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import {
  Grid,
  Spinner,
  Heading,
  Flex,
  VStack,
  Divider,
  Center,
  Box,
  Card,
  CardBody,
  Text
} from "@chakra-ui/react";

function Order() {
  const { data, loading } = useQuery(QUERY_USER);
  let user;

  if (data) {
    user = data.user;
  }
  console.log(user);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Flex justify={"center"} mt={50}>
      {user ? (
        <>
          <VStack>
            <Link to="/" color="black">
              ← Back to Products
            </Link>
            <h2>Order History for {user.username}</h2>

            <Grid
              templateRows={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              templateColumns={{
                base: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
            >
              {user.orders.map((order) => (
                <Card key={order._id} p={{ base: 0, md: 5 }} h={700}>
                  <CardBody>
                    {new Date(
                      parseInt(order.purchaseDate)
                    ).toLocaleDateString()}
                  {order.products.map(({ _id, image, name, price }) => (
                    <>
                      <Link to={`/products/${_id}`}>
                      <Box
              role={"group"}
              p={6}
              maxW={"330px"}
              w={"full"}
              bg={"white"}
              boxShadow={"2xl"}
              rounded={"lg"}
              pos={"relative"}
              zIndex={1}
              h={500}
              >
              <img alt={name} src={`/images/${image}`} />
              <Text pt={10}
                  fontSize={"md"}
                  pb={"10px"}
                  align={"center"}
                  fontWeight={700}>
              <p>{name}</p>
        <div>
          <span>${price}</span>
        </div>

              </Text>
              </Box>
                        <Box
                          rounded={"lg"}
                          mt={-20}
                          pos={"relative"}
                          height={"230px"}
                          _after={{
                            transition: "all .3s ease",
                            content: '""',
                            w: "full",
                            h: "full",
                            pos: "absolute",
                            top: 5,
                            left: 0,
        
                            filter: "blur(15px)",
                            zIndex: -1,
                          }}
                          _groupHover={{
                            _after: {
                              filter: "blur(20px)",
                            },
                          }}
                          >

                        </Box>
                      </Link>
                    </>
                  ))}
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </VStack>
        </>
      ) : null}
    </Flex>
  );
}

export default Order;
