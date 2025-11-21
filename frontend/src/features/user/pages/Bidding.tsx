import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
  Clock,
  Users,
  Gavel,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  Calendar,
  User,
  DollarSign,
  Timer,
  Bell,
  Settings,
  Sparkles,
  Crown,
} from "lucide-react";

const Bidding: React.FC = () => {
  const [currentBid, setCurrentBid] = useState(1250);
  const [userBid, setUserBid] = useState("");
  const [activeTab, setActiveTab] = useState("live");

  const featuredArtwork = {
    id: 1,
    title: "Midnight Symphony",
    artist: "Alexandra Morgan",
    currentBid: 1250,
    minBid: 1400,
    bids: 24,
    timeLeft: "45m 12s",
    likes: 142,
    views: 1200,
    description:
      "A captivating digital art piece blending urban landscapes with cosmic elements.",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop",
  };

  const artworks = [
    {
      id: 1,
      title: "Starry Night Reflection",
      artist: "Elena Rodriguez",
      currentBid: 1250,
      bids: 24,
      timeLeft: "2h 15m",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Urban Dreams",
      artist: "Marcus Chen",
      currentBid: 3200,
      bids: 18,
      timeLeft: "5h 30m",
      image:
        "https://images.unsplash.com/photo-1543857778-c4a1a569e45e?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Ocean Symphony",
      artist: "Sarah Wilson",
      currentBid: 850,
      bids: 31,
      timeLeft: "1h 45m",
      image:
        "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400&h=300&fit=crop",
    },
  ];

  const biddingHistory = [
    { bidder: "ArtCollector88", amount: 1250, time: "2 min ago" },
    { bidder: "ModernArtFan", amount: 1200, time: "5 min ago" },
    { bidder: "GalleryPro", amount: 1150, time: "15 min ago" },
  ];

  const handlePlaceBid = () => {
    const bidAmount = parseInt(userBid);
    if (bidAmount > currentBid) {
      setCurrentBid(bidAmount);
      setUserBid("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Art Auctions</h1>
          </div>
          <p className="text-slate-400">
            Bid on exclusive artworks from talented artists
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Simple Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="live" className="flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Live
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="ended" className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Ended
                </TabsTrigger>
              </TabsList>

              <TabsContent value="live" className="space-y-6">
                {/* Featured Artwork - Simplified */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <Badge className="bg-purple-600">Featured</Badge>
                    </div>
                    <CardTitle className="text-xl text-white">
                      {featuredArtwork.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      by {featuredArtwork.artist}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Artwork Image */}
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={featuredArtwork.image}
                        alt={featuredArtwork.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    {/* Simple Stats */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-400">
                          ${currentBid}
                        </div>
                        <div className="text-xs text-slate-400">
                          Current Bid
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">
                          {featuredArtwork.bids}
                        </div>
                        <div className="text-xs text-slate-400">Bids</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-400">
                          {featuredArtwork.timeLeft}
                        </div>
                        <div className="text-xs text-slate-400">Time Left</div>
                      </div>
                    </div>

                    {/* Simple Bid Form */}
                    <div className="space-y-3">
                      <Label htmlFor="bid" className="text-white text-sm">
                        Place Your Bid (Min: ${featuredArtwork.minBid})
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <Input
                            id="bid"
                            type="number"
                            placeholder="Enter amount"
                            value={userBid}
                            onChange={(e) => setUserBid(e.target.value)}
                            className="pl-9 bg-slate-700 border-slate-600 text-white"
                            min={featuredArtwork.minBid}
                          />
                        </div>
                        <Button
                          onClick={handlePlaceBid}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Bid
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Bids - Simplified */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Recent Bids
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {biddingHistory.map((bid, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 bg-slate-600">
                              <AvatarFallback className="text-xs bg-slate-500">
                                {bid.bidder[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white text-sm">
                                {bid.bidder}
                              </p>
                              <p className="text-xs text-slate-400">
                                {bid.time}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-green-400">
                            ${bid.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* More Auctions - Clean Grid */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Live Auctions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {artworks.map((artwork) => (
                      <Card
                        key={artwork.id}
                        className="bg-slate-800 border-slate-700"
                      >
                        <CardContent className="p-0">
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <div className="p-3 space-y-2">
                            <div>
                              <h4 className="font-semibold text-white text-sm">
                                {artwork.title}
                              </h4>
                              <p className="text-xs text-slate-400">
                                by {artwork.artist}
                              </p>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <p className="text-slate-400">Current Bid</p>
                                <p className="font-bold text-green-400">
                                  ${artwork.currentBid}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-slate-400">Time Left</p>
                                <p className="font-semibold text-orange-400">
                                  {artwork.timeLeft}
                                </p>
                              </div>
                            </div>

                            <Button className="w-full text-xs bg-slate-700 hover:bg-slate-600">
                              Place Bid
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upcoming">
                <Card className="bg-slate-800 border-slate-700 text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <CardTitle className="text-white mb-2">Coming Soon</CardTitle>
                  <p className="text-slate-400 text-sm">
                    New auctions starting soon
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="ended">
                <Card className="bg-slate-800 border-slate-700 text-center py-8">
                  <Timer className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                  <CardTitle className="text-white mb-2">
                    Auction Ended
                  </CardTitle>
                  <p className="text-slate-400 text-sm">
                    Check back for new auctions
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Simplified */}
          <div className="space-y-4">
            {/* User Info */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Active Bids</span>
                  <Badge className="bg-blue-600">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Won Auctions</span>
                  <Badge className="bg-green-600">7</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Total Spent</span>
                  <span className="font-semibold text-white">$8,450</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Watchlist
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Top Artists */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">
                  Top Artists
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artworks.map((artist, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <Avatar className="w-8 h-8 bg-slate-600">
                      <AvatarFallback className="text-xs">
                        {artist.artist[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">
                        {artist.artist}
                      </p>
                      <p className="text-xs text-slate-400">Digital Artist</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bidding;
