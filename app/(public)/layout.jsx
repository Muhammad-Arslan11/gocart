"use client";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/nextjs";

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
      dispatch(fetchCarts({ getToken }));
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
