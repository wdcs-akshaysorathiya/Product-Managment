const express = require('express');
require('./config/db');
const cors = require('cors')
const User = require('./scheme/User');
const Products = require('./scheme/Products');
const Category = require('./scheme/Category');
const Jwt = require('jsonwebtoken');
const Jwtkey = 'products';
const multer = require("multer");
const fileupload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');
const { response } = require('express');
var randtoken = require('rand-token');
const { rawListeners } = require('./scheme/User');

cloudinary.config({
    cloud_name: 'drimho7ok',
    api_key: '245127377844289',
    api_secret: 'zrhFl12_KdVyONkCTji2-dEA9ug',
});

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('upload'));

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "upload")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + '.jpg')
        }
    })
}).single('image')


const OTPVerification = async (email) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: 'akshay.sorathiya@webcluesinfotech.com',
            pass: '~Akshu@2511'
        }
    });
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    await User.updateOne(
        { email: email },
        {
            $set: {
                otp: otp,
                timeStamp: Date.now()
            }
        });

    const mailOptions = {
        from: 'akshay.sorathiya@webcluesinfotech.com',
        to: email,
        subject: 'OTP verification',
        html: `<p>Yor one time otp code is here <b> ${otp} </b></p>`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
    })
}

const sendForgotPasswordEmail = async (email, randGenerateToken) => {

    var mail = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            user: 'akshay.sorathiya@webcluesinfotech.com',
            pass: '~Akshu@2511'
        }
    });

    var mailOptions = {
        from: 'akshay.sorathiya@webcluesinfotech.com',
        to: email,
        subject: 'Reset Password Link',
        html: '<p>You requested for reset password, kindly use this <a href="http://localhost:3001/resetpassword/?token=' + randGenerateToken + '">link</a> to reset your password</p>'
    };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }
    });
}


app.post('/checkTwoStepAuth', async (req, res) => {
    let email = req.body.email;
    let check = req.body.check;
    useremail = await User.findOne({ email: email });
    if (useremail) {
        let result = await User.updateOne({ email: email }, {
            $set: {
                two_step_auth: check
            }
        })
        res.send({ response: result })
    }
})

app.post('/changepassword', async (req, res) => {
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let email = req.body.email;
    if (oldpassword && newpassword) {
        user = await User.findOne({ password: oldpassword });
        if (user) {
            let result = await User.updateOne({ email: email }, {
                $set: {
                    password: newpassword
                }
            })
            res.send({ response: result })
        } else {
            res.send({ response: 'Enter Wrong Password' })
        }
    } else {
        res.send('Enter all Details')
    }
})


app.post('/sendforgotpasswordlink', async (req, res) => {
    let email = req.body.email;
    useremail = await User.findOne({ email: email });
    if (useremail) {
        var randGenerateToken = randtoken.generate(20);
        let result = await User.updateOne(
            { email: email },
            {
                $set: {
                    forgot_password_token: randGenerateToken
                }
            });
        sendForgotPasswordEmail(email, randGenerateToken);
        res.send({ result: result, response: 'Mail Send To Regestred Email address' })
    } else {
        res.send('This is not a valid Email')
    }
})

app.post('/savenewPassword', async (req, res) => {
    let newPassword = req.body.password;
    let token = req.body.token;
    let resetToken = await User.findOne({ forgot_password_token: token });
    if (resetToken) {
        await User.updateOne({ forgot_password_token: token }, {
            $set: {
                password: newPassword
            }
        })
        res.send('Password Reset Successfully...')
    } else {
        res.send('Link is not Valid')
    }

})


app.post('/verifyotp', async (req, res) => {
    let { email, otp } = req.body
    if (!email && !otp) {
        res.send('Please Enter OTP')
    } else {
        const OTPRecord = await User.find({ email: email })
        if (OTPRecord.length <= 0) {
            res.send('Account record does not exist')
        } else {
            let currentDate = new Date();
            var expiryDate = new Date(OTPRecord.createdAt + 59000);
            // if (currentDate > expiryDate) {
            const timeStamp = OTPRecord[0].timeStamp
            const OTP = OTPRecord[0].otp
            // var currentDate = new Date();
            var futureDate = new Date(currentDate.getTime() + 59000);
            if (timeStamp >= futureDate) {
                res.send('OTP is expire request new one')
            } else {
                let validOTP = OTP === otp
                if (!validOTP) {
                    res.send('invalid OTP')
                } else {
                    let user = await User.findOne({ email: email });
                    Jwt.sign({ user }, Jwtkey, { expiresIn: "24h" }, (err, token) => {
                        if (err) {
                            res.send({ user: 'something went wrong' });
                        }
                        res.send({ user, auth: token });
                    })
                }
            }
        }
    }
});

app.post('/resendotp', async (req, res) => {
    let { email } = req.body
    if (email) {
        OTPVerification(email)
        res.send('otp sent to mail')
    }
})


app.post('/singup', upload, async (req, res) => {
    let userCheck = await User.findOne({ email: req.body.email })
    if (req.body.name && req.body.email && req.body.password) {
        if (userCheck) {
            res.send('user is exist');
        }
        else {
            const details = { ...req.body, image: req.file.image }
            let user = new User(details);
            let result = await user.save();
            result = result.toObject();
            if (result) {
                Jwt.sign({ result }, Jwtkey, { expiresIn: "2h" }, (err, token) => {
                    if (err) {
                        res.send({ result: 'something went wrong' });
                    }
                    res.send({ result, auth: token });
                })
            } else {
                res.send('not valid')
            }
        }
    } else {
        res.send('not valid')
    }
});


app.post('/admin-login', async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user.role === 'admin') {
                Jwt.sign({ user }, Jwtkey, { expiresIn: "24h" }, (err, token) => {
                    if (err) {
                        res.send({ user: 'something went wrong' });
                    }
                    res.send({ user, auth: token });
                })
            } else {
                res.send({ user: 'not found' })
            }
        } else {
            res.send({ user: 'not found' })

        }
    } else {
        res.send({ user: 'not found' })
    }
})

app.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne({ email: req.body.email });
        if (user.role === 'user') {
            if (user.isActive === "true") {
                if (user.two_step_auth === true) {
                    if (req.body.password && req.body.email) {
                        let user = await User.findOne(req.body);
                        if (user) {
                            OTPVerification(req.body.email)
                            res.send({ role: user.role, isActive: user.isActive });
                        } else {
                            res.send({ user: 'not found' })
                        }
                    } else {
                        res.send({ user: 'not found' })
                    }
                } else {
                    if (req.body.password && req.body.email) {
                        let user = await User.findOne(req.body);
                        if (user) {
                            Jwt.sign({ user }, Jwtkey, { expiresIn: "24h" }, (err, token) => {
                                if (err) {
                                    res.send({ user: 'something went wrong' });
                                }
                                res.send({ user, auth: token });
                            })
                        } else {
                            res.send({ user: 'not found' })
                        }
                    } else {
                        res.send({ user: 'not found' })
                    }
                }
            } else {
                res.send('user is blocked')
            }
        }
        else {
            res.send({ user: 'not found' })
        }
    } else {
        res.send('enter flied entry')
    }
})

app.get('/getallproducts', async (req, res) => {
    const aggregateQuery = [
        { $sort: { name: -1 } }
    ];

    if (req.query.key) {
        aggregateQuery.push({
            $match: {
                "$or": [
                    { 'name': { $regex: req.query.key } },
                    { 'category.name': { $regex: req.query.key } },
                    { 'company': { $regex: req.query.key } },
                    { 'price': { $regex: req.query.key } }
                ]
            }
        })
    }
    const categorykey = [...aggregateQuery];
    categorykey.push({ $group: { _id: "$category.name" } })
    let setcategories = await Products.aggregate(categorykey);

    if (req.query.category) {
        aggregateQuery.push({ $match: { 'category.name': { $in: req.query.category.split(',') } } })
    }

    aggregateQuery.push({ $project: { name: 1, price: 1, category: 1, company: 1, image: 1 } });
    const productCount = await Products.aggregate(aggregateQuery);

    aggregateQuery.push({ "$skip": req.query.skip ? parseInt(req.query.skip) : 0 },
        { "$limit": req.query.limit ? parseInt(req.query.limit) : 3 });


    const aggregated = await Products.aggregate(aggregateQuery);
    res.send({ data: aggregated, procount: productCount.length, categorykey: setcategories });

})

app.get('/getallusers', async (req, res) => {
    let users = await User.find({ 'role': 'user' });
    if (users.length > 0) {
        res.send(users);
    } else {
        res.send({ result: 'not found' })
    }
})

app.get('/getoneusers/:id', async (req, res) => {
    let users = await User.findOne({ _id: req.params.id });
    if (users) {
        res.send(users);
    } else {
        res.send({ result: 'not found' })
    }
})

app.put('/getoneusers/:id', async (req, res) => {
    let result = await User.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);
})

app.use(fileupload({
    useTempFiles: true,
}))

app.post('/add-product', async (req, res) => {
    const file = req.files.image;
    cloudinary.uploader.upload(file.tempFilePath, async (err, resp) => {
        if (resp) {
            const name = await Category.findOne({ _id: req.body.category }).populate('name')
            req.body.category = name
            const details = { ...req.body, image: resp.url, category: req.body.category }
            const product = new Products(details)
            let result = await product.save()
            res.send(result)
        }
    })
})

app.get('/get-products', async (req, res) => {
    let products = await Products.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: 'not found' })
    }
})

app.get('/get-category', async (req, res) => {
    let category = await Category.find();
    if (category.length > 0) {
        res.send(category);
    } else {
        res.send({ result: 'not found' })
    }
})

app.post('/add-category', async (req, res) => {
    let category = new Category(req.body);
    let result = await category.save();
    res.send(result);
})

app.delete('/delete-category/:id', async (req, res) => {
    res.send(req.params.id);
    const result = await Category.deleteOne({ _id: req.params.id });
    res.send(result);
})

app.get('/get-one-category/:id', async (req, res) => {
    const result = await Category.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: 'not found' })
    }
})

app.put('/update-category/:id', async (req, res) => {
    let result = await Category.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);

})
app.delete('/delete-products/:id', async (req, res) => {
    res.send(req.params.id);
    const result = await Products.deleteOne({ _id: req.params.id });
    res.send(result);
})

app.get('/get-one-product/:id', async (req, res) => {
    const result = await Products.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: 'not found' })
    }
})

app.put('/update-products/:id', async (req, res) => {
    let result = await Products.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result);


})

// app.get("/search/:serchValue", async (req, res) => {
//     let result = await Products.find({
//         "$or": [
//             { 'name': { $regex: req.params.key } },
//             { 'category': { $regex: req.params.key } },
//             { 'company': { $regex: req.params.key } },
//             { 'price': { $regex: req.params.key } },
//             { 'category': { $elemMatch: { name: req.params.key } } },
//         ]
//     });
//     res.send(result);
// })

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        Jwt.verify(token, Jwtkey, (err, valid) => {
            if (err) {
                res.status(401).send({ result: 'please provide a valid token' });
            } else {
                next();
            }
        });
    } else {
        res.status(401).send({ result: 'please provide token' });
    }
}

app.listen(5000);
