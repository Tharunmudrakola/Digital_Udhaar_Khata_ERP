const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {

  let token;

  // CHECK TOKEN

  if (

    req.headers.authorization &&

    req.headers.authorization.startsWith(
      "Bearer"
    )

  ) {

    try {

      // GET TOKEN

      token =
        req.headers.authorization.split(
          " "
        )[1];

      // VERIFY TOKEN

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );

      // GET USER

      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      // NEXT MIDDLEWARE

      next();

    }

    catch (error) {

      console.log(error);

      return res.status(401).json({

        message:
          "Not authorized, token failed"

      });

    }

  }

  else {

    return res.status(401).json({

      message:
        "No token, authorization denied"

    });

  }

};

module.exports = protect;