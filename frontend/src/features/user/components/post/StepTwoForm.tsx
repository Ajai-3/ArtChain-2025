import React from "react";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";

interface StepTwoFormProps {
  commenting: boolean;
  setCommenting: (val: boolean) => void;
  downloading: boolean;
  setDownloading: (val: boolean) => void;
  privateCollection: boolean;
  setPrivateCollection: (val: boolean) => void;
  forSale: boolean;
  setForSale: (val: boolean) => void;
  priceType: "artcoin" | "fiat";
  setPriceType: (val: "artcoin" | "fiat") => void;
  artcoins: number | "";
  fiat: number | "";
  handleArtcoinChange: (val: string) => void;
  handleFiatChange: (val: string) => void;
}

const StepTwoForm: React.FC<StepTwoFormProps> = ({
  commenting,
  setCommenting,
  downloading,
  setDownloading,
  privateCollection,
  setPrivateCollection,
  forSale,
  setForSale,
  priceType,
  setPriceType,
  artcoins,
  fiat,
  handleArtcoinChange,
  handleFiatChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Turn off commenting</h3>
          <p className="text-sm text-gray-500">You can edit this anytime from the menu.</p>
        </div>
        <Switch checked={commenting} onCheckedChange={setCommenting} variant="green" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Turn Off Downloading</h3>
          <p className="text-sm text-gray-500">Others won't be able to download your artwork.</p>
        </div>
        <Switch checked={downloading} onCheckedChange={setDownloading} variant="green" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Make as Private Collection</h3>
          <p className="text-sm text-gray-500">Only subscribers can view this. Hidden from public gallery.</p>
        </div>
        <Switch checked={privateCollection} onCheckedChange={setPrivateCollection} variant="green" />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">Available for Sale</h3>
            <p className="text-sm text-gray-500">Enable to set a price for your artwork</p>
          </div>
          <Switch checked={forSale} onCheckedChange={setForSale} variant="green" />
        </div>

        {forSale && (
          <>
            <div className="mb-4">
              <h3 className="font-medium mb-2">How would you like to set your price?</h3>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant={priceType === "artcoin" ? "outline" : "ghost"}
                  className={priceType === "artcoin" ? "border-green-500" : ""}
                  onClick={() => setPriceType("artcoin")}
                >
                  ArtCoin (Recommended)
                </Button>
                <Button
                  type="button"
                  variant={priceType === "fiat" ? "outline" : "ghost"}
                  className={priceType === "fiat" ? "border-green-500" : ""}
                  onClick={() => setPriceType("fiat")}
                >
                  Fiat Currency
                </Button>
              </div>
            </div>

            {priceType === "artcoin" && (
              <div className="mt-2">
                <Label htmlFor="artcoins" className="block mb-2">
                  Enter Art Coins (eg: 50, 100)
                </Label>
                <Input
                  id="artcoins"
                  variant="green-focus"
                  type="number"
                  placeholder="Enter amount"
                  className="w-full"
                  value={artcoins}
                  onChange={(e) => handleArtcoinChange(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Conversion Preview: ₹{fiat || 0} = {artcoins || 0} ArtCoins
                </p>
              </div>
            )}

            {priceType === "fiat" && (
              <div className="mt-2">
                <Label htmlFor="fiat" className="block mb-2">
                  Enter Price in ₹
                </Label>
                <Input
                  id="fiat"
                  variant="green-focus"
                  type="number"
                  placeholder="Enter amount in ₹"
                  className="w-full"
                  value={fiat}
                  onChange={(e) => handleFiatChange(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Conversion Preview: {fiat || 0} ₹ = {artcoins || 0} ArtCoins
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StepTwoForm;
