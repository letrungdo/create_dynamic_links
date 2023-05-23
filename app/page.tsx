"use client";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { isAndroid, isIOS } from "react-device-detect";

const uniDomain = "appversion.kcmfa.dev.guide.inc";
const androidPackageName = "com.kabu.kcmfa.dev.guide";
const iosAppStoreId = "1661298233";
var _timeout: NodeJS.Timeout;
export default function Home() {
  const [barCode, setBarCode] = useState("");
  const [link, setLink] = useState("");
  const [uniLink, setUniLink] = useState("");
  const [uniLinkPlus, setUniLinkPlus] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current!, (result) => {
      if (result) {
        setBarCode(result);
      }
    });
    qrScanner.start();
    () => {
      qrScanner.stop();
    };
  }, []);

  const createLink = async () => {
    const res = await fetch(`/api/dynamic-links?barCode=${barCode}`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    const bodyRes = await res.json();
    console.log(bodyRes);
    setLink(bodyRes.shortLink);
  };

  const createUniLinkPlus = () => {
    let uniLink = `https://${uniDomain}/?barcode_uri=${barCode}`;
    if (isAndroid) {
      uniLink = `intent://${uniDomain}/?barcode_uri=${barCode}#Intent;package=${androidPackageName};scheme=https;S.browser_fallback_url=https://play.google.com/store/apps/details?id=${androidPackageName};end`;
    } else if(isIOS) {
      uniLink = `https://appversion.kcmfa.dev.guide.inc/store-links/fallback.html?barcode_uri=${barCode}`
    }

    setUniLinkPlus(uniLink);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <video ref={videoRef}></video>
      <div className="flex items-center mt-4">
        <p className="mr-4">Barcode uri</p>
        <input
          className="text-black p-1"
          value={barCode}
          onChange={(ev) => setBarCode(ev.currentTarget.value)}
        />
      </div>
      <button
        className="mt-10 border p-2 whitespace-nowrap"
        onClick={createLink}
      >
        Create Dynamic Link
      </button>
      <button
        className="mt-4 border p-2 whitespace-nowrap"
        onClick={() => {
          setUniLink(
            `https://appversion.kcmfa.dev.guide.inc/?barcode_uri=${barCode}`
          );
        }}
      >
        Create Uni Link
      </button>
      <button
        className="mt-4 border p-2 whitespace-nowrap"
        onClick={createUniLinkPlus}
      >
        Create Uni Link Plus
      </button>
      <a className="mt-5 text-white text-two-line" href={link}>
        {link}
      </a>
      <a className="mt-5 text-white text-two-line" href={uniLink}>
        {uniLink}
      </a>
      <a
        className="mt-5 text-white text-two-line"
        href={uniLinkPlus}
      >
        {uniLinkPlus ? "Open app" : ""}
      </a>
      <div className="mb-auto" />
    </main>
  );
}
