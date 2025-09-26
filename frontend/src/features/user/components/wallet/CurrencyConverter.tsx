import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";

const CurrencyConverter: React.FC = () => {
  const [inr, setInr] = useState<string>("");
  const rate = 10;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInr(value);
    }
  };

  const validNumber = inr !== "";
  const artRaw = validNumber ? Number(inr) / rate : NaN;

  const formatResult = (n: number) => {
    if (!Number.isFinite(n)) return "";
    return n % 1 === 0 ? String(n) : n.toFixed(2);
  };

  const artDisplay = validNumber ? formatResult(artRaw) : "";

  return (
    <Card className="flex-1 dark:bg-secondary-color border border-zinc-600">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <label>From</label>
        <Input
          type="text"
          value="INR"
          disabled
          className="bg-background dark:text-gray-100"
        />

        <label>To</label>
        <Input
          type="text"
          value="ArtCoin (AC)"
          disabled
          className="bg-main-color/20"
        />

        <Input
          type="text"
          inputMode="numeric"
          placeholder="Enter INR amount"
          value={inr}
          onChange={handleChange}
          className="bg-transparent"
        />

        {/* Result */}
        {validNumber && (
          <p className="text-green-400 font-semibold">
            {inr} INR = {artDisplay} AC
          </p>
        )}

        <p className="text-gray-400 text-xs mt-1">
          Exchange rate: 1 AC = ₹{rate} INR
        </p>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
