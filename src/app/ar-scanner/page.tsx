'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { Camera, ScanLine } from 'lucide-react';

const arImage = PlaceHolderImages.find((img) => img.id === 'ar-landmark');

export default function ARScannerPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setShowInfo(true);
        }, 2000); // Simulate scanning for 2 seconds
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="AR Landmark Scanner"
                description="Point your camera at a landmark to learn more about it. (This is a UI demonstration)"
            />
            <div className="relative w-full max-w-4xl mx-auto aspect-video overflow-hidden rounded-lg shadow-2xl bg-slate-900">
                {arImage ? (
                    <Image
                        src={arImage.imageUrl}
                        alt={arImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={arImage.imageHint}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-white">
                        <Camera className="size-16" />
                    </div>
                )}
                
                {isScanning && (
                    <div className="absolute inset-0 bg-primary/20 flex flex-col items-center justify-center">
                        <div className="w-full h-full relative overflow-hidden">
                            <div className="absolute top-0 w-full h-1 bg-sky-300 shadow-[0_0_10px_2px_#87CEEB] animate-scan" />
                        </div>
                        <p className="absolute text-primary-foreground font-bold text-lg tracking-widest">SCANNING...</p>
                    </div>
                )}


                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <Button size="lg" onClick={handleScan} disabled={isScanning} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        {isScanning ? 'Scanning...' : 'Scan Landmark'}
                    </Button>
                </div>

                <Dialog open={showInfo} onOpenChange={setShowInfo}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Eiffel Tower</DialogTitle>
                            <DialogDescription>
                                Paris, France
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <p>
                                The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li><strong>Height:</strong> 330 m</li>
                                <li><strong>Opened:</strong> March 31, 1889</li>
                                <li><strong>Architect:</strong> Stephen Sauvestre</li>
                            </ul>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
             <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
