import {NextApiRequest, NextApiResponse} from "next";
import {trackSession} from "../../utils/astradb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const timestamp = req.body.timestamp;
    const wallet_address = req.body.wallet_address;
    const product_id = req.body.product_id;
    const action = req.body.action;
    if (req.method === 'POST') {
        const data = await trackSession(timestamp, wallet_address, product_id, action);
        res.status(200).json(data);
    }
}