"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useUser } from "@auth0/nextjs-auth0"
import Image from 'next/image';
import { userAgent } from 'next/server';

function page() {

  const { user , isLoading } = useUser();
  const logoutRef = useRef(null);

  const handleDeleteSession = async() => {
    try{
      const userAgent = navigator.userAgent.split(" ")[0]
      const response = await axios.delete("/api/deleteSession",{
        data: {
          userAgent
        }
      })

      const { message , user } = response.data;

      console.log("response", response.data);
      console.log("user session deleted", user);

      if(message === "Session Deleted"){
        if(logoutRef.current){
          logoutRef.current.click();
        }
      }
    } catch(error) {
      console.log("error ", error);
    }
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {user && (
        <>
        <div style={{ textAlign: "center" }}>
          <Image
            src={user.picture}
            width={30}
            height={30}
            alt="Profile"
            className='object-cover rounded-full' 
          />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <pre>{JSON.stringify(user , null , 2)}</pre>
        </div>
        <a href="/auth/logout" ref={logoutRef} onClick={handleDeleteSession} >
            Logout
        </a>
        </>
      )}
    </div>
  )
}

export default page