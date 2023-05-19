import type { NextApiRequest, NextApiResponse } from "next";

const createLinks = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const payload = {
    dynamicLinkInfo: {
      domainUriPrefix: "https://kcmfa.page.link",
      link: `https://kcmfa.guide.inc/?barcode_uri=${query.barCode}`,
      androidInfo: {
        androidPackageName: "com.kabu.kcmfa.dev.guide",
      },
      iosInfo: {
        iosBundleId: "com.kabu.kcmfa.dev.guide",
        iosAppStoreId: "1661298233",
      },
    },
  };
  const ress = await fetch(
    `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.apiKey}`,
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      mode: "cors",
    }
  );
  const bodyRes = await ress.json();

  res.status(ress.status).json(bodyRes);
};

export default createLinks;
