// components/QRCodeButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

interface QRCodeButtonProps {
    onShowQRCode: () => void;
    isShowing: boolean;
}

export default function QRCodeButton({ onShowQRCode, isShowing }: QRCodeButtonProps) {
    return (
        <Button
            variant="outline"
            className="w-full mt-4 h-12"
            onClick={onShowQRCode}
        >
            <QrCode className="mr-2 h-4 w-4" />
            {isShowing ? 'Sembunyikan QR Code' : 'Tampilkan QR Code'}
        </Button>
    );
}