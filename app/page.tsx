"use client";
import { useState } from "react";


export default function Home() {
  const [barCode, setBarCode] = useState("");
  const [link, setLink] = useState("");

  const createLink = async () => {
    const payload = {
      dynamicLinkInfo: {
        domainUriPrefix: "https://kcmfa.page.link",
        link: `https://kcmfa.guide.inc/?barcode_uri=${barCode}`,
        androidInfo: {
          androidPackageName: "com.kabu.kcmfa.dev.guide",
        },
        iosInfo: {
          iosBundleId: "com.kabu.kcmfa.dev.guide",
          iosAppStoreId: "1661298233",
        },
      },
    };
    const res = await fetch(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.apiKey}`,
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const bodyRes = await res.json();
    console.log(bodyRes);
    setLink(bodyRes.shortLink);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center">
        <p className="mr-4">Barcode uri</p>
        <input
          className="text-black p-1"
          value={barCode}
          onChange={(ev) => setBarCode(ev.currentTarget.value)}
        />
      </div>
      <button className="mt-10 border p-2" onClick={createLink}>
        Create dynamic link
      </button>
      <a className="mt-5 text-red" href={link}>{link}</a>
      <div className="mb-auto" />
    </main>
  );
}
