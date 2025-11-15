'use client';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TooManyDevicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const userId = searchParams.get('userId');
  const sessions = searchParams.get('currentSessions');
  const [devices , setDevices] = useState([]);
  const [loading , setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get("/api/registerSession",{
          params: {
           userId: userId
          }
        });
        console.log("response", response.data.user);
        setDevices(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchUser();
  }, [loading]);

  const handleClick = async(userAgent) => {

    const response = await axios.post("/api/forceLogout",{
      userAgent: userAgent
    });

    const { message, user }  = response.data;
    
    console.log("message: " , message);
    console.log("user logged out: ", user);
    alert("redirecting to / page");
    router.push("/");
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold">Login Blocked</h1>
      <p>Reason: {reason}</p>
      <p>User ID: {userId}</p>
      <p>Active Sessions: {sessions}</p>
      {/* <pre>{JSON.stringify(response , null , 2)}</pre> */}
      <div className="w-full">
        {
        loading ? (
            <div className="">Loading.........</div>
        ) : (
            (
         devices.length > 0 ? (
            devices.map((device, key) => (
                <div className="p-2 group hover:cursor-pointer relative flex flex-col gap-0.5 items-center shadow-black shadow-[2px_2px_2px]"
                onClick={() => setOpen(!open)}>
                    <div className={`absolute shadow-black shadow-[3px_3px_3px] top-5 right-5 hidden lg:group-hover:block hover:cursor-pointer ${open ? "block" : "hidden"}`}
                    onClick={() => handleClick(device.userAgent.split(" ")[0])}>
                      Remove User
                    </div>
                    <p>{device.userId}</p>
                    <p>{device.userAgent.split(" ")[0]}</p>
                    <p>{device.deviceId}</p>
                    <p>{device.ip}</p>
                </div>
            ))
        ) : (
            <p>No user found.</p>
        )
    )
        )
      }
      </div>
    </div>
  );
}