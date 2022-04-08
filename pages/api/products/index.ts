import {NextApiRequest, NextApiResponse} from "next";
import {getProducts, trackSession} from "../../../utils/products";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const data = await getProducts()
    res.status(200).json(data);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data = await trackSession()
    res.status(200).json(data);
  }
}
