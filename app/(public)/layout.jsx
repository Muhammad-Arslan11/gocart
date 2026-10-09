"use client";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/nextjs";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { authUser } from "@/middleware/authUser";
import { createUser } from "@/middleware/createUser";

export default function PublicLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, []);
  useEffect(() => {
    if (user) {
      // check if user exists in the db as well
      // const authUser = authUser(user);
      // if (!authUser) {
      //   // user doesn't exist in the db: now, create it
      //   createUser(user);
      // }
      dispatch(fetchCart({ getToken }));
      dispatch(fetchAddress({ getToken }));
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      dispatch(uploadCart({ getToken }));
    }
  }, [cartItems]);

  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
