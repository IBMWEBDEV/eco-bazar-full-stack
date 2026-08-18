// const { mailVerification } = require("../utils/email")
const { mailVerification, resetPasswordMail, mailVerificationEmail } = require("../utils/email")
const User = require('../models/userModels')
const { emptyFieldValidation } = require("../utils/validation")
const tokenGenerator = require("../utils/tokenGenerator")
const existingData = require("../utils/existingData")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let registrationController = async(req, res) => {
    const { firstName, lastName, email, password, confirmPassword, terms } = req.body

    let users = await existingData(res, { email: email })
    if (users) {
        return res.send({
            success: false,
            message: "User exist"
        })
    }


    if (!terms) {
        return res.send({
            success: false,
            message: "Please Accept Our Terms and Condition"
        })
    }


    emptyFieldValidation(res, email, password, confirmPassword)

    if (password !== confirmPassword) {
        return res.send({
            success: false,
            message: "password no matched"
        })
    }

    const hash = bcrypt.hashSync(password, 10);

    let user = new User({
        firstName,
        lastName,
        email,
        password: hash,
        terms
    });

    await user.save()

    let token = tokenGenerator({
        id: user.id,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET, "1d")

    mailVerification(token, email, user.firstName)

    res.send({
        success: true,
        message: "Registration Successfull, Please check your emal for verification"
    })

}


let loginController = async(req, res) => {
    const { email, password } = req.body;

    emptyFieldValidation(res, email, password);

    let user = await User.findOne({ email });

    if (!user) {
        return res.send({
            success: false,
            message: "User not found",
        });
    }

    const matched = bcrypt.compareSync(password, user.password);

    if (!matched) {
        return res.send({
            success: false,
            message: "Invalid Credential",
        });
    }

    const token = tokenGenerator({
            id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "7d"
    );

    const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        role: user.role,
        isVerified: user.isVerified,
        isHold: user.isHold,
    };

    res.send({
        success: true,
        message: "Login Successful",
        user: userData,
        token,
    });
};

let forgotPasswordController = async(req, res) => {
    let { email } = req.body
    emptyFieldValidation(res, email)
    let users = await User.findOne({ email: email });
    if (!users) {
        return res.send({
            success: false,
            message: "User not found"
        })
    }


    let token = tokenGenerator({
        id: users.id,
        email: users.email
    }, process.env.ACCESS_TOKEN_SECRET, "1d")

    resetPasswordMail(token, email, users.firstName)

    res.send({
        success: true,
        message: "Please check your email"
    })

}

let resetPasswordController = async(req, res) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (!password || !confirmPassword) {
        return res.send({
            success: false,
            message: "Please fill all fields"
        });
    }

    if (password !== confirmPassword) {
        return res.send({
            success: false,
            message: "Confirm password not matched"
        });
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async function(err, decoded) {
            if (err) {
                return res.send({
                    success: false,
                    message: "Unauthorized"
                });
            }

            try {
                const hash = bcrypt.hashSync(password, 10);

                await User.findByIdAndUpdate(
                    decoded.id, {
                        password: hash,
                    }, {
                        new: true,
                    }
                );

                return res.send({
                    success: true,
                    message: "Password Updated Successfully",
                });

            } catch (error) {
                return res.send({
                    success: false,
                    message: "Something went wrong",
                });
            }
        }
    );
};

let resendVerificationEmailController = async(req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.send({
            success: false,
            message: "Email is required",
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.send({
            success: false,
            message: "User not found",
        });
    }

    const token = tokenGenerator({
            id: user.id,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1d"
    );

    mailVerification(token, email);

    return res.send({
        success: true,
        message: "Check your email for verification",
    });
};

let verifyEmailController = async(req, res) => {
    const { token } = req.params

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded) {
        if (err) {
            return res.send({ message: "Unauthorized" })
        } else {
            const userId = decoded.id;
            let findUser = await User.findById(userId);
            if (findUser.isVerified) {
                return res.send({ message: "User already verified" });
            } else {
                findUser.isVerified = true;
                await findUser.save();
                return res.send({
                    success: true,
                    message: "Email verified successfully"

                });
            }
        }

    })
}

module.exports = { registrationController, loginController, forgotPasswordController, resetPasswordController, resendVerificationEmailController, verifyEmailController }