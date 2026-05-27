import React from 'react'
import { cilBell } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react';

const Notification = () => {
    return (
        <CButton color="light" className="position-relative rounded-circle p-2">
            <CIcon icon={cilBell} size="lg" />
            {/* Optional: Add a badge */}
            <span
                className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                style={{ fontSize: '8px' }}
            ></span>
        </CButton>
    );
};

export default Notification;