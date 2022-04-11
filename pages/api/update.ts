import {NextApiRequest, NextApiResponse} from "next";
import {updateProduct} from "../../utils/astradb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, product_status, account } = req.body
    if (req.method === 'PATCH') {
        const data = await updateProduct(id, product_status, account);
        res.status(200).json(data);
    }
}