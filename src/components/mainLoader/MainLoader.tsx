import logo from "@/assets/images/protrade-logo.svg";
import './styles.css'
import { useEffect, useState } from "react";

export const MainLoader = () => {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowLoader(true), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative flex items-center justify-center h-screen bg-natural-950">
            <div className="flex flex-col items-center justify-center text-center">
                <img
                    src={logo}
                    alt="logo"
                    className="w-16 h-16 mb-4"
                    style={{
                        animation: 'fade 1s ease-in-out'
                    }}
                />
                <h2 className="absolute bottom-[50px] text-base font-bold mb-4">
                    PROTRADE COMMUNITY
                </h2>
                <div className="mt-22 h-8">

                    {showLoader && (
                        <div className="global-loader " >

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}