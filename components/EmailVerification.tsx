"use client";

import { AlertCircle, CheckCircle, Mail, RefreshCw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface EmailVerificationProps {
  email: string;
  onVerify: (
    email: string,
    token: string
  ) => Promise<{ success: boolean; message: string }>;
  onResendCode: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  onCancel: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerify,
  onResendCode,
  onCancel,
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle timer for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every((digit) => digit !== "") && value) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true);
    setError("");
    setSuccess("");

    try {
      const result = await onVerify(email, verificationCode);

      if (result.success) {
        setSuccess(result.message);
        // The parent component will handle navigation
      } else {
        setError(result.message);
        // Reset code on error
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Verification failed. Please try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const result = await onResendCode(email);

      if (result.success) {
        setSuccess(result.message);
        setCanResend(false);
        setResendTimer(60); // 60 second cooldown
      } else {
        setError(result.message);
        // If rate limited, set a longer cooldown
        if (
          result.message.includes("60 seconds") ||
          result.message.includes("wait")
        ) {
          setCanResend(false);
          setResendTimer(60);
        } else if (result.message.includes("few minutes")) {
          setCanResend(false);
          setResendTimer(300); // 5 minutes for rate limit
        }
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-semibold text-gray-900">{email}</span>
        </p>
      </div>

      {/* Verification Code Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          Enter verification code
        </label>
        <div className="flex justify-center space-x-3" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg transition-colors ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : success
                  ? "border-green-300 focus:border-green-500 focus:ring-green-200"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
              } focus:outline-none focus:ring-2`}
              disabled={isVerifying}
            />
          ))}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Manual Verify Button (shown when code is complete but not auto-submitted) */}
        {code.every((digit) => digit !== "") && !isVerifying && (
          <button
            onClick={() => handleVerify(code.join(""))}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Verify Email
          </button>
        )}

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">
            Didn&apos;t receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || isResending}
            className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
              canResend && !isResending
                ? "text-green-600 hover:text-green-700"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${isResending ? "animate-spin" : ""}`}
            />
            <span>
              {isResending
                ? "Sending..."
                : !canResend
                ? `Resend code in ${resendTimer}s`
                : "Resend code"}
            </span>
          </button>
        </div>

        {/* Cancel/Back Button */}
        <button
          onClick={onCancel}
          className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back to Login
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Check your spam folder if you don&apos;t see the email.
          <br />
          The verification code expires in 10 minutes.
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
