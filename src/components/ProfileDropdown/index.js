import React, { useState } from 'react';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import { cilAccountLogout, cilEnvelopeOpen, cilSettings, cilUser } from '@coreui/icons';
import { CBadge, CDropdownDivider, CDropdownHeader } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import { auth_service } from '../../auth/auth';

const ProfileDropdown = () => {
    const [visible, setVisible] = useState(false);

    const handleToggle = () => {
        setVisible((prevVisible) => !prevVisible);
    };

    const dropdownSections = [
        {
            header: 'Account',
            items: []
        },
        {
            // header: 'Settings',
            items: [
                {
                    label: 'Profile',
                    icon: cilUser,
                    href: '#',
                },
                {
                    label: 'Settings',
                    icon: cilSettings,
                    href: '#',
                }
            ],
        },
    ];

    const RenderDropdownMenu = () => {
        return (
            <CDropdownMenu className="pt-0" placement="bottom-end">
                {dropdownSections && dropdownSections.map((section, index) => (

                    <div key={index}>
                        {section?.header && (
                            <CDropdownHeader className="bg-light fw-semibold py-2">
                                {section.header}
                            </CDropdownHeader>
                        )}
                        {section?.items.map((item, idx) => (
                            <CDropdownItem href={item.href} key={idx} style={{ cursor: 'pointer' }} >
                                <CIcon icon={item.icon} className="me-2" />
                                {item.label}
                                {item.badge && (
                                    <CBadge color={item.badge.color} className="ms-2">
                                        {item.badge.text}
                                    </CBadge>
                                )}
                            </CDropdownItem>
                        ))}
                    </div>
                ))}
                <CDropdownDivider />
                <CDropdownItem onClick={() => auth_service.logout()} style={{ cursor: 'pointer' }} >
                    <CIcon icon={cilAccountLogout} className="me-2" />
                    Logout
                </CDropdownItem>
            </CDropdownMenu>
        );
    };

    return (
        <CDropdown alignment="end" visible={visible} onVisibleChange={setVisible} >
            <CDropdownToggle className="p-0 border-0 bg-transparent" caret={false} onClick={() => { handleToggle() }} >
                <img
                    src="https://ui-avatars.com/api/?name=Dheeraj+Khanna"
                    alt="User"
                    className="rounded-circle"
                    width="36"
                    height="36"
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                />
            </CDropdownToggle>
            {visible && RenderDropdownMenu()}
        </CDropdown>
    );
};

export default ProfileDropdown;
