// Anything in 'api' are serverless functions (lambdas)

export default (req, res) => {
  res.status(200).json({ text: 'Hello' })
}
