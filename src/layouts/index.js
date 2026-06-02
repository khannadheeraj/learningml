import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import MainlLayout from './MainlLayout';
import SideBar from './SideBar';

const DefaultLayout = () => {
    const [sidebarShow, setSidebarShow] = useState(true);

    return (
        <div>
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