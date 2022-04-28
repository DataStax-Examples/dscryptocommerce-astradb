import {NextApiRequest, NextApiResponse} from "next";
import {updateBidNFT} from "../../../utils/astradb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.body.id;
    const product_status = req.body.product_status;
    const account = req.body.account;
    if (req.method === 'PATCH') {
        const data = await updateBidNFT(id, product_status, account);
        res.status(200).json(data);
    }
}