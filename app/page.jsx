"use client"
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from 'next/image';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { motion , AnimatePresence} from "motion/react"
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { userAgent } from 'next/server';
import { useRouter } from "next/navigation";

function page() {

  const {user , isLoading } = useUser();
  const isAuthenticated = user ? true : false;
  const [isTrue , setIsTrue] = useState(false);
  const [stage , setStage] = useState("add");
  const logoutRef = useRef(false);
  const clickedOnce = useRef(false);
  const [formdata , setFormData] = useState({
    fullName: "",
    phoneNumber: ""
  })
  const router = useRouter();

  useEffect(() => {
    const interval = setTimeout(async() => {
      try{
        const res = await axios.post("/api/check-invalid",{
          userAgent: navigator.userAgent.split(" ")[0]
        })

        if(res.data.invalid){
          alert(res.data.reason)
          localStorage.clear();

          window.location.href = "/?forced=true";
        }
      }
      catch(error) {
        console.log("error",error);
      }
    }, 5000);

    return () => clearTimeout(interval);
  },[])

  useEffect(() => {
    const check = async() => {
      try{
        const agent = navigator.userAgent.split(" ")[0];
        console.log(agent);
        const response = await axios.get("/api/session",{
          params: {
            userAgent : agent
          }
        })

        console.log("rs data", response.data);

        const { message , user } = response.data;

        if(user && user.fullName && user.phoneNumber){
          setFormData({
            fullName: user.fullName,
            phoneNumber: user.phoneNumber
          })
        }

        console.log("response", user, message);
        // if(message === "user not found"){
        //   alert("pls login again!!");
        //   if(user && logoutRef.current){
        //      logoutRef.current.click();
        //   }
        // }

        if(user && !user.fullName && !user.phoneNumber){
          setIsTrue(true);
          setFormData({
            fullName: "",
            phoneNumber: ""
          })
        } else {
          setIsTrue(false);
        }
      } catch (error) {
        setIsTrue(false);
        console.log("is auth",isAuthenticated);
        if(isAuthenticated){
          logoutRef.current?.click();
        }
        console.log("Error",error);
        console.log("response ", error.response.data.message);
      }
    }

    check();

  },[isAuthenticated])

  useEffect(() => {

    console.log("skdjh",isAuthenticated);
    
    if(isAuthenticated){
    const handleDeleteSession = async() => {
      const userAgent = navigator.userAgent.split(" ")[0];
      const response = await axios.delete("/api/deleteSession",{
        data: {
          userAgent
        }
       })

      const { message, user } = response.data;
      console.log("response deleted session", message , user); 
    }

    // handleDeleteSession();
      console.log("is authei akma",isAuthenticated)
   } else {
      console.log("user is there!!", user);
    }
  },[isAuthenticated])

  const handleChange = (e) => {
    const { name , value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name] : value,
    }))
  }

  const handleSend = async() => {
    try{
      setStage("processing");
      // if(!formdata.fullName.length || !formdata.phoneNumber.length ){
      //   alert("pls fill the fullName and Number");
      // }
      const response = await axios.patch("/api/session",{
        userAgent: navigator.userAgent.split(" ")[0],
        fullName : formdata.fullName, 
        phoneNumber : formdata.phoneNumber
      })

      console.log("response see ", response.data);

      if(response.data.message === "Session updated successfully"){
        setIsTrue(false);
        toast.success("fullName and phoneNumber added!", { duration: 1000 });
        setStage("add");
      }

      setFormData({
        fullName: "",
        phoneNumber: ""
      })
    } catch(error) {
      setStage("add");
      console.log("error", error);
      if(error.response.data.message === "user not found!"){
        setIsTrue(false);
      }
      toast.error("something happend try again!!")
    }
  }

  return (
    <div className='relative h-screen w-full'>
      <Toaster />
      {isLoading && <p className='p-2 w-24 rounded-md shadow-black shadow-[5px_5px_2px]'>Loading...</p>}
      {
        !user && !isLoading && (
          <a href="/auth/login" className='p-2'>Login</a>
        )
      }
      {
        user && (
          <>
          <div className="p-2 shadow-black w-38 shadow-[3px_3px_3px]">
            Full Name: {formdata.fullName}
            Phone Number: {formdata.phoneNumber}
          </div>
          <div className="p-2 mt-3 flex items-center justify-center w-24 rounded-md hover:cursor-pointer shadow-black shadow-[5px_5px]"
          onClick={() => redirect("/profile")}>
            Profile
          </div>
          </>
        )
      }
      <a href="/auth/logout" ref={logoutRef} className='hidden'>
        Logout
      </a>
      <div className="">
         <AnimatePresence>
                {
                  isTrue && (
                    <motion.div
                    //  ref={constRef}
                      initial={{ width: 0, height: 0, opacity: 0, filter: "blur(10px)" }}
                      animate={{
                        width: 400,
                        height: 200,
                        filter: "blur(0px)",
                        opacity: 1,
                        transition: { duration: 0.5, ease: "easeInOut" },
                      }}
                      exit={{
                         width: 0,
                         height: 0,
                         filter: "blur(10px)",
                         opacity: 0,
                         transition: { duration: 0.2, ease: "easeInOut" },
                       }}
                      className="fixed top-1/2 left-1/2 bg-indigo-500 rounded-2xl -translate-x-1/2 -translate-y-1/2 flex p-3 text-white shadow-lg">
                       <div className="w-full">
                        <div className="text-center font-bold w-full text-xl">
                          Fill This!!
                        </div>
                        <div className="">
                          <input type="text" value={formdata.fullName} onChange={handleChange} name='fullName' placeholder='Full Name' className='w-full h-11 border-none outline-none py-1 px-2'/>
                        </div>
                        <div className="">
                          <input type="text" value={formdata.phoneNumber} onChange={handleChange} name='phoneNumber' placeholder='Phone Number' className='w-full h-11 border-none outline-none py-1 px-2'/>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="py-1 px-5 hover:cursor-pointer bg-green-500 text-black rounded-md" 
                          onClick={handleSend}>
                            {
                              stage === "add" && (
                                <span>Add</span>
                              )
                            }
                            {
                              stage === "processing" && (
                                <div className="h-3 w-3 rounded-full border-t border-l animate-spin border-cyan-400"></div>
                              )
                            }
                          </div>
                        </div>
                       </div>
                    </motion.div>
                  )
                }
          </AnimatePresence>
      </div>
    </div>
  )
}

export default page
