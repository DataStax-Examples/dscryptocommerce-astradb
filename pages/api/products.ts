import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // create goes here
    res.status(200).json({ name: 'John Doe' })
  }
  if (req.method === 'GET') {
    // Get goes here
    res.status(200).json({ name: 'John Doe' })
  }
  if (req.method === 'PUT') {
    // update goes here
    res.status(200).json({ name: 'John Doe' })
  }
}