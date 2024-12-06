import React from "react";
import Dashboard from "@/components/dash/Dashboard";
import AdminProtector from "@/Protector/Admin";

const Page = () => {
    return (
        <div className=''>
            <AdminProtector>
                <Dashboard/>
            </AdminProtector>
        </div>
    );
};

export default Page;
