"use client";

import React, { useEffect, useState } from "react";

const Greetings = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hoursString = now.toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: "Asia/Manila",
      });

      const hours = Number(hoursString);

      let greet = "";
      if (hours >= 5 && hours < 12) {
        greet = "Good morning";
      } else if (hours >= 12 && hours < 18) {
        greet = "Good afternoon";
      } else {
        greet = "Good evening";
      }

      setGreeting(greet);
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000); // update every minute
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h3 className="font-semibold text-2xl tracking-tight">
        {greeting}, Administrator! 👋
      </h3>
	  <p className='text-muted-foreground mt-1'>Here’s What happening on your store today. See the statistics at once.</p>
    </div>
  );
};

export default Greetings;
