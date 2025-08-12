import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import type { RootState } from "../../../../redux/store";
import type { User } from "../../../../types/user";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const BecomeArtistModal = ({ isOpen, onClose }: ModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { user } = useSelector((state: RootState) => state.user) as {
    user: User | null;
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }
    // Submit logic here
    console.log("Submitting application...", { phoneNumber });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white border border-zinc-800 dark:bg-secondary-color p-6 rounded-lg w-[90%] max-w-xl">
        <h2 className="text-xl text-center mb-4 font-bold">Become an Artist</h2>

        <div className="space-y-4 mb-4">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="block mb-2">Name</label>
              <Input
                variant="green-focus"
                value={user?.name || ""}
                disabled={true}
              />
            </div>
            <div className="w-full">
              <label className="block mb-2">Username</label>
              <Input
                variant="green-focus"
                value={user?.username || ""}
                disabled={true}
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
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block mb-2">Country</label>
              <Input
                variant="green-focus"
                value={user?.country || ""}
                placeholder="Enter your country"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Bio</label>
            <Textarea
              variant="green-focus"
              rows={3}
              value={user?.bio || ""}
              placeholder="Tell us about yourself"
              readOnly
            />
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
            disabled={!termsAccepted}
          >
            Submit Application
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Note: Admin will manually review and approve your request within 24-48
          hours.
        </p>
      </div>
    </div>
  );
};

export default BecomeArtistModal;
