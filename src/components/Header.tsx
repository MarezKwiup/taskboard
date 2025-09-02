import { CiWifiOff } from "react-icons/ci";
import { CiWifiOn } from "react-icons/ci";
import { useEffect, useState } from "react";

const Header = () => {
  const [online, setOnline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log("User is online");
      setOnline(true);
    };
    const handleOffline = () => {
      console.log("User is offline");
      setOnline(false);
    };

    if (navigator.onLine) handleOnline();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex justify-between m-4 p-4">
      <div className="flex flex-col">
        <span className="text-4xl font-semibold">Taskboard</span>
        <div className="flex mt-4 text-[#797986]">
          {online ? (
            <>
              <CiWifiOn color="#23C45D" size={24} />
              <p className="ml-2 ">Real time sync is active</p>
            </>
          ) : (
            <>
              <CiWifiOn color="#EE4443" size={24} />
              <p className="ml-2 ">Real time sync is inactive</p>
            </>
          )}
        </div>
      </div>
      <p>Hey</p>
    </div>
  );
};

export default Header;
