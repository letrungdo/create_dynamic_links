"use client";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [barCode, setBarCode] = useState("");
  const [link, setLink] = useState("");
  const [uniLink, setUniLink] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const qrScanner = new QrScanner(videoRef.current!, (result) =>
      {
        if(result) {
          setBarCode(result);
        }
      }
    );
    qrScanner.start();
    () => {
      qrScanner.stop();
    };
  }, []);

  const createLink = async () => {
    const res = await fetch(
      `/api/dynamic-links?barCode=${barCode}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
      }
    );
    const bodyRes = await res.json();
    console.log(bodyRes);
    setLink(bodyRes.shortLink);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <video ref={videoRef}></video>
      <div className="flex items-center mt-4">
        <p className="mr-4">Barcode uri</p>
        <input
          className="text-black p-1"
          value={barCode}
          onChange={(ev) => setBarCode(ev.currentTarget.value)}
        />
      </div>
      <button className="mt-10 border p-2" onClick={createLink}>
        Create Dynamic Link
      </button>
      <button className="mt-4 border p-2" onClick={() => {
        setUniLink(`https://appversion.kcmfa.dev.guide.inc/?barcode_uri=${barCode}`)
      }}>
        Create Uni Link
      </button>
      <a className="mt-5 text-white" href={link}>
        {link}
      </a>
      <a className="mt-5 text-white" href={uniLink}>
        {uniLink}
      </a>
      <div className="mb-auto" />
    </main>
  );
}
