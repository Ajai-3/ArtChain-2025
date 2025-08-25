import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import type { RootState } from "../../../../redux/store";
import type { User } from "../../../../types/user/user";
import { useCreateArtistRequestMutation } from "../../../../api/user/auth/mutations";
import toast from "react-hot-toast";
import { z } from "zod";
import { useHasSubmittedArtistRequest } from "../../../../api/user/art/queries";

// Zod schema
export const createArtistRequestSchema = z.object({
  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
    .max(300, "Bio must not exceed 300 characters")
    .refine((val) => val.trim() !== "", "Bio cannot be empty"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers")
    .refine((val) => val.trim() !== "", "Phone cannot be empty"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(56, "Country name too long")
    .regex(/^[A-Za-z\s]+$/, "Country must contain only letters")
    .refine((val) => val.trim() !== "", "Country cannot be empty"),
});

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BecomeArtistModal = ({ isOpen, onClose }: ModalProps) => {
  const { user } = useSelector((state: RootState) => state.user) as {
    user: User | null;
  };
  const mutation = useCreateArtistRequestMutation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{
    phone?: string;
    bio?: string;
    country?: string;
  }>({});

  const { data, isLoading, isError } = useHasSubmittedArtistRequest();

  useEffect(() => {
    if (isOpen && user) {
      setPhoneNumber(user.phone || "");
      setBio(user.bio || "");
      setCountry(user.country || "");
      setErrors({});
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const validateField = (field: "phone" | "bio" | "country", value: string) => {
    try {
      createArtistRequestSchema
        .pick({ [field]: true } as { bio?: true; phone?: true; country?: true })
        .parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
    }
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    const payload: { phone?: string; bio?: string; country?: string } = {};
    if (phoneNumber && phoneNumber !== user?.phone) payload.phone = phoneNumber;
    if (bio && bio !== user?.bio) payload.bio = bio;
    if (country && country !== user?.country) payload.country = country;

    const result = createArtistRequestSchema.safeParse({
      phone: payload.phone || user?.phone || "",
      bio: payload.bio || user?.bio || "",
      country: payload.country || user?.country || "",
    });

    if (!result.success) {
      const fieldErrors: { phone?: string; bio?: string; country?: string } =
        {};
      result.error.errors.forEach((err) => {
        if (err.path[0])
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white border border-zinc-800 dark:bg-secondary-color p-6 rounded-lg w-[90%] max-w-xl">
        <h2 className="text-xl text-center mb-4 font-bold">Become an Artist</h2>
        {data?.alreadySubmitted && !isLoading ? (
          <>
            <div>
              <p>
                Your artist request is{" "}
                <strong>{data.latestRequest.status}</strong>. Submitted on{" "}
                <strong>
                  {new Date(data.latestRequest.createdAt).toLocaleDateString()}
                </strong>
                . Our admin will review it soon.
              </p>

              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-4">
              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block mb-2">Name</label>
                  <Input
                    variant="green-focus"
                    value={user?.name || ""}
                    disabled
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-2">Username</label>
                  <Input
                    variant="green-focus"
                    value={user?.username || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <label className="block mb-2">Phone Number</label>
                  <Input
                    variant="green-focus"
                    type="tel"
                    placeholder="7558092430"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      validateField("phone", e.target.value);
                    }}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block mb-2">Country</label>
                  <Input
                    variant="green-focus"
                    value={country}
                    placeholder="Enter your country"
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                      setCountry(value);
                      validateField("country", value);
                    }}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2">Bio</label>
                <Textarea
                  variant="green-focus"
                  rows={3}
                  value={bio}
                  placeholder="Enter your bio"
                  onChange={(e) => {
                    setBio(e.target.value);
                    validateField("bio", e.target.value);
                  }}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
              </div>

              <div className="flex items-start space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="main"
                onClick={handleSubmit}
                disabled={!termsAccepted || mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Note: Admin will manually review and approve your request within
              24-48 hours.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default BecomeArtistModal;
