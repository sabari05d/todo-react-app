import React, { useState } from "react";
import logoImage from '../../public/icon-512x512.png';
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const OnboardingSlides = ({ onFinish }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    const nextSlide = () => {
        if (currentSlide < totalSlides - 1) setCurrentSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
    };

    const handleFinish = () => {
        if (!isChecked && currentSlide === 2) {
            alert("Please agree to the terms to continue.");
            return;
        }
        localStorage.setItem("onboardingCompleted", "true");
        if (onFinish) onFinish();
        navigate("/sign-up");
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-ligh p-3" style={{ background: '#caf0f8' }}>
            <div className="card text-center shadow p-4 w-100" style={{ maxWidth: "500px", borderRadius: "1rem" }}>
                {/* Slide Content */}
                {currentSlide === 0 && (
                    <>
                        <div className="mb-3 d-flex justify-content-center">
                            <Image
                                src={logoImage}
                                alt="Logo"
                                style={{
                                    maxWidth: "150px",
                                    borderRadius: "50%",
                                    // border: "2px solid #0d6efd",
                                    padding: "5px",
                                }}
                            />
                        </div>
                        <h1 className="mb-3 fw-bold" style={{ color: "#0d6efd" }}>
                            Welcome to DoQuest
                        </h1>
                        <p className="text-muted mb-4 fs-5">
                            Turn your daily tasks into achievements and embark on your personal quest.
                        </p>
                    </>
                )}

                {currentSlide === 1 && (
                    <>
                        <h1 className="mb-3 fw-bold" style={{ color: "#0d6efd" }}>
                            What You Can Do
                        </h1>
                        <ul className="list-group  text-center mb-4 border-0 ">
                            <li className="list-group-item p-2 border-0">✅ Create & manage tasks</li>
                            <li className="list-group-item p-2 border-0">⏳ Set deadlines & reminders</li>
                            <li className="list-group-item p-2 border-0">🎯 Track your progress like a quest</li>
                        </ul>
                    </>
                )}

                {currentSlide === 2 && (
                    <>
                        <h1 className="mb-3 fw-bold" style={{ color: "#0d6efd" }}>
                            Your Privacy Matters
                        </h1>
                        <p className="text-muted mb-3 fs-6">
                            We respect your privacy. Your data is stored safely on your device.
                        </p>
                        <div className="form-check d-flex justify-content-center mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="termsCheck"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <label className="form-check-label ms-2" htmlFor="termsCheck">
                                I agree to the terms
                            </label>
                        </div>
                    </>
                )}

                {/* Navigation buttons */}
                <div className="d-flex justify-content-between mt-3">
                    {currentSlide > 0 ? (
                        <button className="btn btn-secondary" onClick={prevSlide}>
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentSlide < totalSlides - 1 ? (
                        <button className="btn btn-primary" onClick={nextSlide}>
                            Next
                        </button>
                    ) : (
                        <button className="btn btn-success" onClick={handleFinish}>
                            Get Started
                        </button>
                    )}
                </div>
            </div>

            {/* Dots indicator */}
            <div className="d-flex justify-content-center mt-3 d-none">
                {[...Array(totalSlides)].map((_, index) => (
                    <div
                        key={index}
                        className={`rounded-circle me-2`}
                        style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: index === currentSlide ? "#0d6efd" : "#ced4da",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
