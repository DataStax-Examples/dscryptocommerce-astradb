import {NextApiRequest, NextApiResponse} from "next";
import {getProduct} from "../../../utils/products";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (req.method === 'GET') {
    const data = await getProduct(id as string);
    res.status(200).json(data);
  }
}