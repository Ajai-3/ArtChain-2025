// import React, { useState, useEffect } from "react";
// import { Button } from "../../../../components/ui/button";
// import { Input } from "../../../../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../../components/ui/select";
// import { auth, setUpRecaptcha, sendOtp, verifyOtp } from "../../../../firebase/config";

// const COUNTRY_CODES = [
//   { code: "+1", name: "United States" },
//   { code: "+44", name: "United Kingdom" },
//   { code: "+91", name: "India" },
//   // Add more as needed
// ];

// const VerifyPhoneNumber: React.FC = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [countdown, setCountdown] = useState(60);
//   const [canResend, setCanResend] = useState(false);
//   const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
//   const [verificationId, setVerificationId] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let timer: NodeJS.Timeout;

//     if (isOtpSent && countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     } else if (countdown === 0) {
//       setCanResend(true);
//     }

//     return () => clearTimeout(timer);
//   }, [countdown, isOtpSent]);

//   const handleGetOtp = async () => {
//     try {
//       setError("");
//       const fullPhoneNumber = `${selectedCountryCode}${phoneNumber.replace(/\D/g, "")}`;
//       const recaptchaVerifier = setUpRecaptcha("recaptcha-container");

//       const confirmation = await sendOtp(fullPhoneNumber, recaptchaVerifier);
//       setVerificationId(confirmation.verificationId);
//       setIsOtpSent(true);
//       setCountdown(60);
//       setCanResend(false);
//     } catch (err) {
//       setError("Failed to send OTP. Please try again.");
//       console.error(err);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       const result = await verifyOtp(verificationId, otp);
//       // Phone number verified successfully
//       console.log("Verification successful:", result);
//       // You can now:
//       // 1. Redirect the user
//       // 2. Store the token (result.token)
//       // 3. Update user state
//     } catch (err) {
//       setError("Invalid OTP. Please try again.");
//       console.error(err);
//     }
//   };

//   const handleResendOtp = () => {
//     handleGetOtp();
//   };

//   return (
//     <div className="space-y-3">
//       <div id="recaptcha-container"></div>

//       <div className="flex gap-2">
//         <div className="flex-1 flex gap-2">
//           <Select
//             value={selectedCountryCode}
//             onValueChange={setSelectedCountryCode}
//           >
//             <SelectTrigger className="w-[140px]" variant="green-focus">
//               <SelectValue placeholder="Code" />
//             </SelectTrigger>
//             <SelectContent className="max-h-[300px] overflow-y-auto">
//               {COUNTRY_CODES.map((country) => (
//                 <SelectItem
//                   key={country.code}
//                   value={country.code}
//                   className="flex items-center gap-2"
//                 >
//                   <span className="font-medium">{country.code}</span>
//                   <span className="text-muted-foreground"> {country.name}</span>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <div className="flex-1">
//             <Input
//               variant="green-focus"
//               type="tel"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               className="border p-2 rounded"
//               placeholder="(123) 456-7890"
//               disabled={isOtpSent}
//             />
//           </div>
//         </div>

//         {!isOtpSent && (
//           <Button variant="main" onClick={handleGetOtp}>
//             Get OTP
//           </Button>
//         )}
//       </div>

//       {isOtpSent && (
//         <div className="space-y-3">
//           <div>
//             <Input
//               variant="green-focus"
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full border p-2 rounded"
//               placeholder="Enter OTP"
//             />
//             {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//           </div>
//           <div className="flex justify-between items-center">
//             <Button onClick={handleVerifyOtp}>Verify OTP</Button>

//             {canResend ? (
//               <Button
//                 onClick={handleResendOtp}
//                 className="text-blue-500 text-sm"
//               >
//                 Resend OTP
//               </Button>
//             ) : (
//               <span className="text-gray-500 text-sm">
//                 Resend in {countdown}s
//               </span>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VerifyPhoneNumber;