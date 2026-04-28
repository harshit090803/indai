"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowLeft, Star, Zap, Infinity } from 'lucide-react';
import '../legal.css'; // Reusing the global/legal background styles for consistency

export default function PricingPage() {
    const router = useRouter();

    const plans = [
        {
            name: "Basic Premium",
            price: "₹199",
            duration: "/ month",
            icon: <Star size={24} color="#3b82f6" />,
            features: [
                "Unlimited questions in all topics",
                "Advanced LLM Model Access",
                "Priority response time",
                "No Ads"
            ],
            buttonText: "Subscribe Monthly",
            popular: false
        },
        {
            name: "Developer Pro",
            price: "₹999",
            duration: "/ month",
            icon: <Code2 size={24} color="#10b981" />,
            features: [
                "Everything in Basic",
                "10,000 API calls / month",
                "Custom API Generation",
                "Priority Developer Support"
            ],
            buttonText: "Get API Access",
            popular: true
        },
        {
            name: "Annual Ultimate",
            price: "₹1999",
            duration: "/ year",
            icon: <Infinity size={24} color="#8b5cf6" />,
            features: [
                "Everything in Pro",
                "Best Value (Save ₹389)",
                "Dedicated Tutor Bot",
                "Downloadable Chat Histories"
            ],
            buttonText: "Go Annual",
            popular: false
        }
    ];

    const [processingPlan, setProcessingPlan] = React.useState(null);
    const [step, setStep] = React.useState('none'); // none, payment, success

    const handlePayment = (plan) => {
        setProcessingPlan(plan);
        setStep('payment');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                setStep('none');
                setProcessingPlan(null);
                if (plan.name.toLowerCase().includes('developer')) {
                    router.push('/developer');
                }
            }, 2500);
        }, 2000);
    };

    return (
        <div className="legal-container" style={{ minHeight: '100vh', padding: '40px 20px', fontFamily: '"Inter", sans-serif', color: '#fff' }}>
            <button
                onClick={() => router.push('/')}
                style={{
                    position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)', zIndex: 10
                }}
            >
                <ArrowLeft size={18} /> Back Home
            </button>

            <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', paddingTop: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', background: 'linear-gradient(45deg, #FF9933, #FFFFFF, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    IndAI Premium & API
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
                    Choose the perfect plan for your learning or development needs.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
                    {plans.map((plan, index) => (
                        <div key={index} style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            border: plan.popular ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '24px',
                            padding: '40px 30px',
                            textAlign: 'left',
                            position: 'relative',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            boxShadow: plan.popular ? '0 10px 40px rgba(16, 185, 129, 0.2)' : '0 10px 30px rgba(0,0,0,0.5)',
                            transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                            zIndex: plan.popular ? 2 : 1
                        }}>
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase'
                                }}>
                                    Recommended
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                                    {plan.icon}
                                </div>
                                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{plan.name}</h3>
                            </div>

                            <div style={{ marginBottom: '30px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{plan.price}</span>
                                <span style={{ fontSize: '1rem', color: '#aaa' }}> {plan.duration}</span>
                            </div>

                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#eee', fontSize: '0.95rem' }}>
                                        <CheckCircle2 size={18} color="#10a37f" /> {feature}
                                    </li>
                                ))}
                            </ul>

                            <button style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: plan.popular ? 'linear-gradient(90deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                            }}
                                onMouseOver={(e) => {
                                    if (!plan.popular) e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    if (!plan.popular) e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onClick={() => handlePayment(plan)}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mock Razorpay Modal */}
            {step !== 'none' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
                }}>
                    <div style={{
                        background: '#fff', color: '#333', width: '100%', maxWidth: '400px',
                        borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ background: '#222', padding: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>IN</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>IndAI Payments</div>
                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{processingPlan?.name} Plan</div>
                            </div>
                        </div>

                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            {step === 'payment' ? (
                                <>
                                    <div className="payment-spinner" style={{
                                        width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #3b82f6',
                                        borderRadius: '50%', margin: '0 auto 20px auto', animation: 'spin 1s linear infinite'
                                    }}></div>
                                    <h3 style={{ margin: 0 }}>Securely processing payment...</h3>
                                    <p style={{ color: '#666' }}>Do not refresh the page.</p>
                                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={60} color="#10a37f" style={{ margin: '0 auto 20px auto' }} />
                                    <h3 style={{ margin: 0, color: '#10a37f' }}>Payment Successful!</h3>
                                    <p style={{ color: '#666' }}>Your account has been upgraded. Redirecting...</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
