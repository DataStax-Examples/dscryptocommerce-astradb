import {NextApiRequest, NextApiResponse} from "next";
import {trackSession} from "../../utils/astradb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { dateTime, account, product_id, session_message } = req.body
    if (req.method === 'POST') {
        const data = await trackSession(dateTime, account, product_id, session_message);
        res.status(200).json(data);
    }
}