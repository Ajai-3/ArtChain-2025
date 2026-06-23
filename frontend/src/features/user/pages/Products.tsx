import React from 'react';
import { ExternalLink, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const Products = () => {
  const lioraUrl = import.meta.env.VITE_LIORA_AI_URL || "https://liora-ai-2025.vercel.app/";
  const artScaleUrl = import.meta.env.VITE_ARTSCALE_STUDIO_URL || "https://art-scale-studio-2026.vercel.app/";

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Layers className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Our Ecosystem</h1>
          <p className="text-muted-foreground mt-1 text-lg">Explore other amazing products built by our team.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Liora AI Card */}
        <Card className="flex flex-col overflow-hidden border-border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <img src="/liora.png" alt="Liora AI" className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-1 ring-border" />
            <div>
              <CardTitle className="text-2xl">Liora Ai</CardTitle>
              <CardDescription className="text-sm mt-1">AI Image Generation</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-muted-foreground leading-relaxed flex-1">
              Liora.Ai is a high-speed, AI-powered platform that instantly transforms your text prompts into stunning visual art. It bridges the gap between imagination and reality, helping creators and marketers bring any vision to life in seconds.
            </p>
            <div className="pt-6 mt-auto">
              <Button asChild className="w-full gap-2 group-hover:bg-primary/90 transition-colors">
                <a href={lioraUrl} target="_blank" rel="noopener noreferrer">
                  Visit Liora Ai <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ArtScale Studio Card */}
        <Card className="flex flex-col overflow-hidden border-border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <img src="/artscalestudio.png" alt="ArtScale Studio" className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-1 ring-border" />
            <div>
              <CardTitle className="text-2xl">ArtScale Studio</CardTitle>
              <CardDescription className="text-sm mt-1">Privacy-First Reference Tool</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-muted-foreground leading-relaxed flex-1">
              ArtScale Studio is a privacy-first, high-precision reference tool designed for traditional artists. Built with a "local-only" philosophy, it allows artists to prepare reference images with technical accuracy using the Grid Method, ensuring perfect proportions for physical canvas work without the need for an account or cloud storage.
            </p>
            <div className="pt-6 mt-auto">
              <Button asChild variant="secondary" className="w-full gap-2 group-hover:bg-secondary/80 transition-colors">
                <a href={artScaleUrl} target="_blank" rel="noopener noreferrer">
                  Visit ArtScale Studio <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Products;
