"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft } from 'lucide-react';
import BackgroundSlideshow from '../../components/BackgroundSlideshow';
import '../legal.css';

const TermsOfService = () => {
    const router = useRouter();

    return (
        <div className="legal-wrapper">
            <BackgroundSlideshow />
            <div className="legal-container animate-fade-in">
                <button className="back-btn" onClick={() => router.back()}>
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="legal-header">
                    <FileText size={48} className="legal-icon" />
                    <h1>Terms of Service</h1>
                    <p>Last Updated: June 10, 2023</p>
                </div>

                <div className="legal-content">
                    <p>By accessing or using the IndAI service, you agree to be bound by these Terms of Service.</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By using our services, you agree to these Terms and our Privacy Policy. If you do not agree, you may not use our services.</p>

                    <h2>2. Service Description</h2>
                    <p>IndAI provides artificial intelligence solutions and services designed for the Indian market ("Services"). We reserve the right to modify or discontinue the Services at any time.</p>

                    <h2>3. User Accounts</h2>
                    <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>

                    <h2>4. User Responsibilities</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use the Services for any illegal purpose</li>
                        <li>Violate any laws in your jurisdiction</li>
                        <li>Infringe upon our intellectual property rights</li>
                        <li>Upload or transmit viruses or any harmful code</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Use the Services to harass, abuse, or harm others</li>
                        <li>Engage in any activity that interferes with the Services</li>
                    </ul>

                    <h2>5. Content Ownership</h2>
                    <p>You retain ownership of any content you submit through our Services. By submitting content, you grant us a worldwide license to use, reproduce, and display such content.</p>

                    <h2>6. Intellectual Property</h2>
                    <p>The Services and all contents, features, and functionality are owned by IndAI and are protected by copyright, trademark, and other intellectual property laws.</p>

                    <h2>7. Payments and Subscriptions</h2>
                    <p>Certain features may require payment. You agree to pay all charges for purchases made through your account.</p>

                    <h2>8. Termination</h2>
                    <p>We may terminate or suspend your account immediately, without prior notice, for any reason, including if you breach these Terms.</p>

                    <h2>9. Disclaimer of Warranties</h2>
                    <p>The Services are provided "as is" without warranty of any kind. We do not guarantee that the Services will be uninterrupted or error-free.</p>

                    <h2>10. Limitation of Liability</h2>
                    <p>In no event shall IndAI be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Services.</p>

                    <h2>11. Governing Law</h2>
                    <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

                    <h2>12. Changes to Terms</h2>
                    <p>We reserve the right to modify these Terms at any time. Your continued use of the Services after any changes constitutes acceptance of the new Terms.</p>

                    <h2>13. Contact Information</h2>
                    <p>For any questions about these Terms, please contact us at <a href="mailto:support@indai.com">support@indai.com</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
