import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import MainlLayout from './MainlLayout';
import SideBar from './SideBar';

const DefaultLayout = () => {
    const [sidebarShow, setSidebarShow] = useState(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        return window.innerWidth >= 992;
    });

    useEffect(() => {
        const handleResize = () => {
            setSidebarShow(window.innerWidth >= 992);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="app-layout">
            <Header sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
            <SideBar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
            <div className="wrapper d-flex flex-column min-vh-100 wseInfratechBodyBG pt-3 pb-footer">
                <div className="body flex-grow-1 px-3">
                    <MainlLayout />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
