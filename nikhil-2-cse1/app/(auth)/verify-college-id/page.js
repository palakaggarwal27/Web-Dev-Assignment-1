"use client"
import { useSession } from "next-auth/react"
import Navbar from "@/component/Header/Navbar"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Upload, GraduationCap } from "lucide-react"

const VerifyCollegeIdPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [collegeEmail, setCollegeEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  useEffect(() => {
    if (session === null) {
      router.push('/signin');
    } else if (session !== undefined) {
      setIsLoading(false);
      fetchUserData();
    }
  }, [session, router]);

  const fetchUserData = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/user/user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      const data = await res.json();
      setUserData(data);
      if (data.collegeEmail) setCollegeEmail(data.collegeEmail);
    } catch (err) {
      console.error(err);
    }
  };

  const sendOTP = async () => {
    if (!collegeEmail) {
      alert("Please enter your college email address");
      return;
    }

    try {
      console.log(collegeEmail)
      const res = await fetch("/api/user/send-college-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          collegeEmail
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent to your college email! Check your inbox.");
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("/api/user/verify-college-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          collegeEmail, 
          otp 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        alert("College ID verified successfully!");
        router.push("/profile");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow border p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify College ID</h1>
            <p className="text-gray-600">
              Please enter your college email ID for verification
            </p>
          </div>

          {userData?.collegeId ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-600 mb-2">Already Verified!</h2>
              <p className="text-gray-600 mb-4">
                Your college ID has been verified. You can enjoy all student benefits.
              </p>
              <button
                onClick={() => router.push("/profile")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Profile
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College Email Address *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={collegeEmail.split('@')[0] || ''}
                    onChange={(e) => setCollegeEmail(e.target.value + '@' + (collegeEmail.split('@')[1] || 'msit.in'))}
                    placeholder="your.username"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    disabled={otpSent}
                  />
                  <select
                    value={collegeEmail.split('@')[1] || 'msit.in'}
                    onChange={(e) => setCollegeEmail((collegeEmail.split('@')[0] || '') + '@' + e.target.value)}
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    disabled={otpSent}
                  >
                    <option value="msit.in">@msit.in</option>
                    <option value="msitjanakpuri.co.in">@msitjanakpuri.co.in</option>
                  
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use your official college/university email address
                </p>
              </div>

              {!otpSent ? (
                <button
                  onClick={sendOTP}
                  className="w-full py-3 px-4 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Send OTP to College Email
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter 6-digit OTP *
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest text-gray-900 placeholder-gray-500"
                      maxLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Check your college email for the OTP
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={verifyOTP}
                      disabled={otp.length !== 6}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                        otp.length !== 6
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      Verify OTP
                    </button>
                    <button
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Change Email
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">OTP Verification Process</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Enter your college email address</li>
                  <li>• We'll send a 6-digit OTP to your college email</li>
                  <li>• Enter the OTP to verify your student status</li>
                  <li>• Verified students get additional credits and features</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyCollegeIdPage;