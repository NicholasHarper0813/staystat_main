import React from "react";
import AdminProtector from "@/Protector/Admin";
import Dashboard from "@/components/dash/Dashboard";

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
