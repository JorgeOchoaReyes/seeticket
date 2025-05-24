import { useRef, useState, useEffect } from "react"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"; 
import {QRCodeSVG} from "qrcode.react";
import { ExternalLink, QrCode, ShareIcon } from "lucide-react";
import { Button } from "../ui/button";

export const QrCodePopup = ({value}: {value?: string}) => {
  const [showSharePopup, setShowSharePopup] = useState(false);  
  const urlRef = useRef<string>(value ?? ""); 

  useEffect(() => {
    if(window.location && !value) {
      urlRef.current = window.location.toString();
    } else if(window.location && value) {
      urlRef.current = window.location.origin + value;
    }
  }, []);

  return ( 
    <Dialog open={showSharePopup} onOpenChange={setShowSharePopup}>
      <DialogTrigger asChild>
        <Button onClick={() => {
          setShowSharePopup(true);
        }}>
          <ShareIcon />  Share 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
               QR Code
          </DialogTitle>
          <DialogDescription>Scan this QR code to visit the official Next.js website</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <QRCodeSVG value={urlRef.current}/>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Scan with your phone camera to visit:</p>
            <div className="flex items-center gap-2 text-sm font-mono bg-gray-100 px-3 py-2 rounded">
              <span className="text-xs">{urlRef.current}</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};