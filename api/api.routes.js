module.exports = ({ app }) => {
  app.route('/profesores')
    .get((req, res) => {
      res.json({"sad": "asd"})
    })
}