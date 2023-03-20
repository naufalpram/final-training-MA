const express = require("express")
const path = require("path")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")

const app = express()
const PORT = 6969 || env.PORTLOC

app.use(cors(corsOptions))

app.use(express.json()) // expressnya bisa baca JSON

app.use("/", require("./routes/root"))

app.use("/users", require("./routes/userRoutes"))

app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
