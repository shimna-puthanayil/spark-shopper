dropdown menu

import { useState, useEffect, useRef } from "react";
// ...

import {
  Box,
  MenuItem,
  MenuList,
  Text,
  Link,
  MenuButton,
  Button,
  Menu,
  Flex,
} from "@chakra-ui/react";
import { useStoreContext } from "../../utils/GlobalState";
import {
  UPDATE_SUBCATEGORIES,
  UPDATE_CURRENT_SUBCATEGORY,
} from "../../utils/actions";
import { useLazyQuery } from "@apollo/client";

import { QUERY_SUBCATEGORIES } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
const styleDropdownSubmenu = {
  position: "absolute",
  left: "100%",
  top: "-7px",
};
export default function Dropdown({
  items,
  depthLevel,
  dropdown,
  subcategories,
  setDropdown,
}) {
  const [state, dispatch] = useStoreContext();
  depthLevel = depthLevel + 1;
  const [getSubCategories] = useLazyQuery(QUERY_SUBCATEGORIES);
  const dropdownClass = depthLevel > 0 ? styleDropdownSubmenu : "";
  const showDropdown = dropdown ? { display: "block" } : "";
//   const ref = useRef();
  // console.log(currentCategory)

  //       if (currentCategory) {
  //         dispatch({
  //           type: UPDATE_SUBCATEGORIES,
  //           subcategories: sub.data,
  //         });
  //         sub.data.subcategories.forEach((category) => {
  //           idbPromise("subcategories", "put", category);
  //         });
  //       } else if (!loading) {
  //         idbPromise("subcategories", "get").then((subcategories) => {
  //           dispatch({
  //             type: UPDATE_SUBCATEGORIES,
  //             subcategories: subcategories,
  //           });
  //         });
  //       }
  //     //   const handler = (event) => {
  //     //     if (dropdown && ref.current && !ref.current.contains(event.target)) {
  //     //        setDropdown(false);
  //     //     }
  //     //  };
  //     //   document.addEventListener("mousedown", handler);
  //     //   document.addEventListener("touchstart", handler);
  //       // console.log(state)

  //     console.log(state)
//   useEffect(() => {
//     //  console.log(categoryData)

//     const handler = (event) => {
//       if (dropdown && ref.current && !ref.current.contains(event.target)) {
//         setDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     document.addEventListener("touchstart", handler);
//   }, [setDropdown, dropdown]);

  const handleClick = async (id) => {
    
    const sub = await getSubCategories({
      variables: {
        category: id,
      },
    });
    dispatch({
      type: UPDATE_SUBCATEGORIES,
      subcategories: sub.data.subcategories,
    });
    setDropdown(true);
    
  };
  const handleItemClick=async(id)=>{
    dispatch({
        type: UPDATE_CURRENT_SUBCATEGORY,
        currentSubCategory: id,
      });
     
  }
  const onMouseEnter = async () => {
    setDropdown(true);
  };

  const onMouseLeave = () => {
    setDropdown(false);
  };
  const closeDropdown = () => {
    dropdown && setDropdown(false);
  };
  return (
    <Flex alignItems={"center"}>
      <Menu placement="right">
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              as={Button}
              colorScheme="WhiteAlpha"
              _hover={{ bg: "gray.400", color: "black" }}
              onClick={() => handleClick(items._id)}
            >
              <Text fontSize={"1xl"}>
                {isOpen ? items.name : items.name}
              </Text>
            </MenuButton>
            <MenuList
             
              display="none"
              {...dropdownClass}
              {...showDropdown}
              //  className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}
              bg={"back.900"}
              color={"white"}
            >
              {subcategories.map((item) => (
                <MenuItem
                as="li"
                  key={item._id}
                  px={2}
                  py={1}
                  bg={"back.900"}
                  _hover={{ bg: "gray.400", color: "black" }}
                  onClick={() => handleItemClick(item._id)}
                
                >
                    <Link  style={{ textDecoration: 'none' }} to={'/'}> {item.name}</Link>
                 
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>
    </Flex>
    // <Box
    //   as="ul"
    //   position="absolute"
    //   right={0}
    //   left="auto"

    //   fontSize="0.875rem"
    //   zIndex={999}
    //   minWidth="10rem"
    //   padding="0.5rem 0"
    //   listStyleType="none"
    //   bgColor={"black"}
    //   borderRadius="0.5rem"
    //   display="none"
    //   {...dropdownClass}
    //   {...showDropdown}
    //   //  className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}
    // >

    // </Box>
  );
}
