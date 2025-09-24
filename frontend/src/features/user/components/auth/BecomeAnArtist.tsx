import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import type { RootState } from "../../../../redux/store";
import type { User } from "../../../../types/users/user/user";
import { useCreateArtistRequestMutation } from "../../hooks/art/useCreateArtistRequestMutation";
import toast from "react-hot-toast";
import { z } from "zod";
import { useHasSubmittedArtistRequest } from "../../hooks/art/useHasSubmittedArtistRequest";
import { COUNTRIES } from "../../../../constants/countries";

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
  const { user } = useSelector((state: RootState) => state?.user) as {
    user: User | null;
  };
  const { supportersCount, supportingCount, artWorkCount } = useSelector(
    (state: RootState) => state.user
  );

  const [communityChecked, setCommunityChecked] = useState(false);
  const [artworkChecked, setArtworkChecked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const mutation = useCreateArtistRequestMutation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState<{
    phone?: string;
    bio?: string;
    country?: string;
  }>({});

  const { data, isLoading, isError, refetch } =
    useHasSubmittedArtistRequest(isOpen);

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
    mutation.mutate(payload, {
      onSuccess: () => {
        refetch();
        toast.success("Request submitted successfully!");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white border border-zinc-800 dark:bg-secondary-color p-6 rounded-lg w-[90%] max-w-xl">
        <h2 className="text-xl text-center mb-4 font-bold">Become an Artist</h2>
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : isError ? (
          <p className="text-red-500 text-center">
            Failed to load request status.
          </p>
        ) : data?.alreadySubmitted &&
          data.latestRequest.status === "pending" ? (
          <div className="text-center">
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize">{data.latestRequest.status}</span>
            </div>

            <div className="mb-2">
              <span className="font-semibold">Submitted On:</span>{" "}
              {new Date(data.latestRequest.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </div>

            {data.latestRequest.reviewedAt && (
              <div className="mb-2">
                <span className="font-semibold">Reviewed On:</span>{" "}
                {new Date(data.latestRequest.reviewedAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            )}

            {data.latestRequest.rejectionReason?.trim() && (
              <div className="mb-2 text-red-600">
                <span className="font-semibold">Rejection Reason:</span>{" "}
                {data.latestRequest.rejectionReason}
              </div>
            )}

            <p className="text-gray-600 mt-4">
              Your request is being reviewed by the admin. You will be notified
              of updates.
            </p>

            <Button variant="outline" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
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
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      validateField("country", e.target.value);
                    }}
                    className="w-full rounded-md border border-gray-300 bg-white dark:bg-secondary-color dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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

              <div className="flex flex-col space-y-2 mt-4">
                <label className="text-sm font-medium">
                  Eligibility Requirements:
                </label>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={communityChecked}
                    onChange={(e) =>
                      setCommunityChecked(
                        supportersCount >= 20 && supportingCount >= 20
                          ? e.target.checked
                          : false
                      )
                    }
                    disabled={supportersCount < 20 || supportingCount < 20}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I have at least 20 supporters ({supportersCount}) and
                    supportings at least 20 users ({supportingCount})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={artworkChecked}
                    onChange={(e) =>
                      setArtworkChecked(
                        artWorkCount >= 10 ? e.target.checked : false
                      )
                    }
                    disabled={artWorkCount < 10}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    I have at least 10 artworks ({artWorkCount})
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={!(communityChecked && artworkChecked)}
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
