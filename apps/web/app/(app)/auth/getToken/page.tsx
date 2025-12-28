"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../../lib/api";

const Page = () => {
  const [token, setToken] = useState([]);
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const token = await fetchAPI("/auth/getToken");
        const data = await token.json();
        console.log(data);
        setToken(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    };
    fetchTokens();
  }, []);
  return <div>{token[0]}</div>;
};

export default Page;
