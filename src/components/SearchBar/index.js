import React from 'react'
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const SearchBar = () => {
    return (
        <div className="d-flex align-items-center" style={{ width: '100%', maxWidth: '500px' }}>
            <input
                type="text"
                placeholder="Search for modules, users, etc."
                className="form-control rounded-pill px-4 py-2"
                style={{
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    paddingRight: '45px'
                }}
            />
            <div
                className="position-absolute me-3"
                style={{
                    right: '10px',
                    backgroundColor: '#2B50EC',
                    borderRadius: '50%',
                    padding: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                <CIcon icon={cilSearch} size="sm" style={{ color: '#fff' }} />
            </div>
        </div>
    );
};

export default SearchBar;