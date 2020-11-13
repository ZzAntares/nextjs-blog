import { NextApiRequest, NextApiResponse } from 'next'

// Anything in 'api' are serverless functions (lambdas)

function handler(_req: NextApiRequest, res: NextApiResponse): void {
  res.status(200).json({ text: 'Hello' })
}

export default handler
