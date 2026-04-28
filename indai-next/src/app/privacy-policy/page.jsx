"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowLeft } from 'lucide-react';
import BackgroundSlideshow from '../../components/BackgroundSlideshow';
import '../legal.css';

const PrivacyPolicy = () => {
    const router = useRouter();

    return (
        <div className="legal-wrapper">
            <BackgroundSlideshow />
            <div className="legal-container animate-fade-in">
                <button className="back-btn" onClick={() => router.back()}>
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="legal-header">
                    <Shield size={48} className="legal-icon" />
                    <h1>Privacy Policy</h1>
                    <p>Last Updated: June 10, 2023</p>
                </div>

                <div className="legal-content">
                    <p>Your privacy is important to us. This Privacy Policy explains how IndAI ("we", "us", or "our") collects, uses, discloses, and safeguards your information when you use our services.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We may collect the following types of information:</p>
                    <ul>
                        <li><strong>Personal Information:</strong> Name, email address, phone number, and other contact details when you register or use our services.</li>
                        <li><strong>Usage Data:</strong> Information about how you interact with our services, including IP address, device information, browser type, and pages visited.</li>
                        <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience and analyze service usage.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the collected information for various purposes:</p>
                    <ul>
                        <li>To provide and maintain our services</li>
                        <li>To notify you about changes to our services</li>
                        <li>To allow you to participate in interactive features</li>
                        <li>To provide customer support</li>
                        <li>To gather analysis or valuable information to improve our services</li>
                        <li>To monitor the usage of our services</li>
                        <li>To detect, prevent, and address technical issues</li>
                    </ul>

                    <h2>3. Data Sharing and Disclosure</h2>
                    <p>We may share your information in the following situations:</p>
                    <ul>
                        <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf.</li>
                        <li><strong>Business Transfers:</strong> In connection with any merger or sale of company assets.</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                    </ul>

                    <h2>4. Data Security</h2>
                    <p>We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

                    <h2>5. Your Data Protection Rights</h2>
                    <p>Depending on your location, you may have rights including:</p>
                    <ul>
                        <li>Access to your personal information</li>
                        <li>Correction of inaccurate data</li>
                        <li>Deletion of your personal data</li>
                        <li>Restriction of processing</li>
                        <li>Data portability</li>
                        <li>Objection to processing</li>
                    </ul>

                    <h2>6. International Data Transfers</h2>
                    <p>Your information may be transferred to and maintained on computers located outside of your country where data protection laws may differ.</p>

                    <h2>7. Children's Privacy</h2>
                    <p>Our services are not intended for children under 13. We do not knowingly collect personally identifiable information from children under 13.</p>

                    <h2>8. Changes to This Privacy Policy</h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

                    <h2>9. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@indai.com">privacy@indai.com</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
