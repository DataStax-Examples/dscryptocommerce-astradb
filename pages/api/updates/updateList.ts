import {NextApiRequest, NextApiResponse} from "next";
import {updateListNFT} from "../../../utils/astradb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.body.id;
    const product_status = req.body.product_status;
    const tokenid = req.body.tokenid;
    console.log(id, product_status, tokenid);
    if (req.method === 'PATCH') {
        const data = await updateListNFT(id, product_status, tokenid);
        res.status(200).json(data);
    }
}