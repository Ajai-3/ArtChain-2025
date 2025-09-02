import React, { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";

const Liora: React.FC = () => {
  const [tab, setTab] = useState("generate");

  return (
    <div className="flex h-full">
      {/* Left Sidebar (Settings) */}
      <div className="w-1/4 border-r border-zinc-400 dark:border-zinc-800 p-4 space-y-4">
        <h2 className="text-lg font-semibold">Settings</h2>

        {/* Model */}
        <div className="space-y-1">
          <Label>Model</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sdxl">Stable Diffusion XL</SelectItem>
              <SelectItem value="flux">Flux</SelectItem>
              <SelectItem value="dreamshaper">DreamShaper</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Image Count */}
        <div className="space-y-1">
          <Label>Image Count</Label>
          <Input type="number" placeholder="1" min={1} max={10} />
        </div>

        {/* Seed */}
        <div className="space-y-1">
          <Label>Seed</Label>
          <Input type="number" placeholder="Random" />
        </div>

        {/* Resolution */}
        <div className="space-y-1">
          <Label>Resolution</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="512x512" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="512x512">512x512</SelectItem>
              <SelectItem value="768x768">768x768</SelectItem>
              <SelectItem value="1024x1024">1024x1024</SelectItem>
              <SelectItem value="portrait">768x1024</SelectItem>
              <SelectItem value="landscape">1024x768</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Main Area */}
      <div className="flex flex-col w-full p-6">
        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="p-4">
          <TabsList>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {tab === "generate" ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Generated Images will appear here */}
              <div className="border rounded-lg h-64 flex items-center justify-center text-zinc-400">
                Generated Image Preview
              </div>
              <div className="border rounded-lg h-64 flex items-center justify-center text-zinc-400">
                Another Preview
              </div>
            </div>
          ) : (
            <div className="text-zinc-400">History of generated images</div>
          )}
        </div>

        {/* Prompt Input (Bottom) */}
        <div className="flex gap-2">
          <Input
            variant="prompt"
            placeholder="Enter your prompt..."
          />

          <Button>Generate</Button>
        </div>
      </div>
    </div>
  );
};

export default Liora;
