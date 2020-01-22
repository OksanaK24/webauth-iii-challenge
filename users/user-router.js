const bcrypt = require("bcryptjs")
const express = require("express")
const usersModel = require("./user-model")
const jwt = require("jsonwebtoken")
const secrets = require("../config/secrets")
const restricted = require("../middleware/restricted")

const router = express.Router()

function generateToken(user){

    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department,
    }
    const options = {
        expiresIn: "1d",
    } 
    
    return jwt.sign(payload, secrets.jwtSecret, options)
}

router.get("/users", restricted(), async (req, res, next) => {
  try {
    const users = await usersModel.find()
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.post("/register", async (req, res, next) => {
    try {
      const saved = await usersModel.add(req.body)
      
      res.status(201).json(saved)
    } catch (err) {
      next(err)
    }
})
  
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await usersModel.findBy({ username }).first()
        const passwordValid = await bcrypt.compare(password, user.password)
      
        if (user && passwordValid) {
            const token = generateToken(user);
            
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token,
          })
        } else {
          res.status(401).json({
            message: "Invalid Credentials",
          })
        }
      } catch (err) {
        next(err)
    }
})

// router.get("/logout", restricted(), (req, res, next) => {
//   req.session.destroy((err) => {
//     if (err) {
//       next(err)
//     } else {
//       res.json({
//         message: "You are logged out",
//       })
//     }
//   })
// })

module.exports = router