import {NextApiRequest, NextApiResponse} from "next";
import {addDraft} from "../../../utils/products";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const account = req.body.seller_address
    const uid = req.body.product_id
    if (req.method === 'POST') {
        const data = await addDraft(name, description, price, uid, account);
        res.status(200).json(data);
    }
}