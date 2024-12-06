"use client";
import { useTheme } from "next-themes";
import { useEffect,useContext, useState } from "react";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";
import { motion } from "framer-motion";
import Context from "@/context/Context";

const Switcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const { isDarkTheme, setIsDarkTheme } = useContext(Context);

    useEffect(()=>{
        setMounted(true);
        setIsDarkTheme(theme === "dark");
    },[theme])

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    return (
        <div>
            <motion.button
                id="theme-btn"
                aria-label="Toggle Dark Mode"
                className="text-2xl ml-auto  flex-shrink-0 rounded-full bg-black/40 dark:bg-gray-600/40 hover:bg-black/60 p-2 text-white dark:hover:text-white dark:hover:bg-gray-500/40 drop focus:outline-none focus:ring-0 focus:ring-white/75 focus:ring-offset-0 focus:ring-offset-gray-800"
                whileTap={{
                    scale: 1,
                    rotate: 360,
                    transition: { duration: 0.4 },
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
                {theme === "dark" ? <BsMoonFill /> : <BsFillSunFill />}
            </motion.button>
        </div>
    );
};
export default Switcher;
