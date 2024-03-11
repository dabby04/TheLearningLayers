const express = require('express');
const router = express.Router();
const User = require("../models/student");

router.post('/createAccount', (req, res) => {
  const userData = req.body;
  // find the email or username in the database
  User.find({ $or: [{ email: userData.email }, { username: userData.username }] }).then(result => {
    if (result.length) {
      // return failed status if user exists
      res.status(400).json({
        status: "FAILED",
        message: "User with the provided email already exists"
      })
    }
    //save to database
    else {
      try {
        const newUser = new User(userData);
        newUser.save();
        res.status(200).send("User saved to the database");
      } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).send("Unable to save user to the database");
      }
    }
  })
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  username = username.trim();
  password = password.trim();

  if (username == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied"
    })
  }
  else {
    //Check if the user exists in the database
    User.find({ username })
      .then(data => {
        if (data.length) {
          //compare the password with the one in the database
          const pass = data[0].password;
          if (password === pass) {
            res.json({
              status: "SUCCESS",
              message: "Login successful",
              data: data
            })
          }
          else {
            res.status(400).json({
              status: "FAILED",
              message: "Invalid password entered"
            })
          }
        }
        else{
          res.status(400).json({
            status: "FAILED",
            message:"Invalid credentials entered!"
          })
        }
      })
      .catch(err=>{
        res.status(500).json({
          status:"FAILED",
          message:"An error occured while checking for existing user"
        })
      })
  }
});

router.post('/user/stores', async (req, res) => {
  const { preferredStores } = req.body;
  const userId = req.user.id; // Assuming you have user authentication and can access the user ID

  try {
    // Update preferredStores for the user in the database
    await User.findByIdAndUpdate(userId, { preferredStores });
    res.status(200).send('Preferred stores updated successfully');
  } catch (error) {
    console.error('Error updating preferred stores:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;