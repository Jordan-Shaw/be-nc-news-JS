exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Found" })
}