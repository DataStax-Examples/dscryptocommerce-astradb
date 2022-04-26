import {NextApiRequest, NextApiResponse} from "next";
import {updateReceiveNFT} from "../../../utils/astradb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const id = req.body.id;
	const product_status = req.body.product_status;
	if (req.method === 'PATCH') {
		const data = await updateReceiveNFT(id, product_status);
		res.status(200).json(data);
	}
}