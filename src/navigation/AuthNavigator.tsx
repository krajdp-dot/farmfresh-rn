import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PhoneEntryScreen from '../screens/PhoneEntryScreen';
import OTPScreen from '../screens/OTPScreen';
import SplashScreen from '../screens/SplashScreen';

type AuthStep = 'splash' | 'phone' | 'otp';

const AuthNavigator: React.FC = () => {
  const { sendOTP, verifyOTP } = useAuth();
  const [step, setStep]             = useState<AuthStep>('splash');
  const [phone, setPhone]           = useState('');
  const [confirmation, setConfirmation] = useState<any>(null);
  const [otpError, setOtpError]     = useState('');

  if (step === 'splash') {
    return <SplashScreen onFinish={() => setStep('phone')} />;
  }

  if (step === 'phone') {
    return (
      <PhoneEntryScreen
        onSubmit={async (p) => {
          setPhone(p);
          const result = await sendOTP(p);
          setConfirmation(result.confirmation ?? null);
          setStep('otp');
        }}
      />
    );
  }

  return (
    <OTPScreen
      phone={phone}
      onVerify={async (otp) => {
        setOtpError('');
        const result = await verifyOTP(confirmation, otp, phone);
        if (!result.success) setOtpError(result.error || 'Invalid OTP. Try again.');
      }}
      onBack={() => { setStep('phone'); setOtpError(''); }}
      error={otpError}
    />
  );
};

export default AuthNavigator;
