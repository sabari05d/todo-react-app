import React from 'react'
import { Spinner } from 'react-bootstrap'
import '../LoadingSpinner.css' // add CSS for overlay

const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <>
            <div className="loading-overlay">
                <div className="loading-content">
                    <Spinner animation="border" variant="light" role="status" />
                    <p className="mt-3 text-light">{text}</p>
                </div>
            </div>
        </>
    )
}

export default LoadingSpinner 
