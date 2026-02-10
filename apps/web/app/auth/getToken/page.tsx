"use client";

import React, { useEffect, useState } from "react";
import { axiosAuthInstance } from "@/utils/axios-auth";

const Page = () => {
  const [token, setToken] = useState<any[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await axiosAuthInstance.get("/auth/getToken");
        console.log(res.data);
        setToken(res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    };

    fetchTokens();
  }, []);

  return <div>{token[0]}</div>;
};

export default Page;
