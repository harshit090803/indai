"use client";
import React, { useState, useEffect } from 'react';
import './BackgroundSlideshow.css';

const images = [
    '/Image Resource/360_F_54043068_Jv1e6QuYbH7R4aX1rTJllIn5TrJU4PLD.jpg',
    '/Image Resource/Hawa Mahal.jfif',
    '/Image Resource/images.jfif',
    '/Image Resource/istockphoto-1455552376-612x612.jpg',
    '/Image Resource/istockphoto-172124032-612x612.jpg',
    '/Image Resource/istockphoto-469872784-612x612.jpg',
    '/Image Resource/istockphoto-519330110-612x612.jpg',
    '/Image Resource/istockphoto-520840182-612x612.jpg',
    '/Image Resource/istockphoto-528284252-612x612.jpg',
    '/Image Resource/istockphoto-543179390-612x612.jpg',
    '/Image Resource/lotus-temple-delhi-1-attr-hero.jfif',
    '/Image Resource/qutub-minar-tower-new-delhi-india_672794-3619.avif'
];

const BackgroundSlideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slideshow-container">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url("${img}")` }}
                ></div>
            ))}
            <div className="slideshow-overlay"></div>
        </div>
    );
};

export default BackgroundSlideshow;
