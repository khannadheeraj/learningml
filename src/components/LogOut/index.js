import React, { useEffect } from "react";
import { auth_service } from "../../auth/auth";

const LogOut = (props) => {

    useEffect(() => {
        auth_service.logout();
    }, [])

    return (
        <></>
    );
}

export default LogOut;