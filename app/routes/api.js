var User = require('../models/userSchema');

var Story = require('../models/story');

var config = require('../../config');

var jsonwebtoken = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var secretKey = config.secretKey;

function createToken(user){

    var token = jsonwebtoken.sign({
        id:user._id,
        name:user.name,
        username:user.username
    },secretKey,{
        expiresIn:1440
    });

    return token;
}

module.exports = function(app,express){
    
    var api = express.Router();

    api.post('/signup',function(req,res){

        var user = new User({

            name:req.body.name,
            username:req.body.username,
            password:req.body.password
        });

        user.save(function(err){
            
            if(err){
                res.send(err);
                return;
            }
            res.json({message:'User has been created'});
        })
    });

    api.get('/users',function(req,res){

        User.find({},function(err,users){

            if(err){
                res.send(err);
                return;
            }

            res.json(users);
        });
    });


    api.post('/login',function(req,res){

        User.findOne({

            username:req.body.username
        }).select('password').exec(function(err,user){

            if(err) throw err;
            
            if(!user){
                
                res.send('User not exist');
            }
            else if(user){

                var validPassword = user.comparePassword(req.body.password);

                if(!validPassword){

                    res.send({message:"Invalid password"});
                }else{
                    //generate token

                    var token = createToken(user);

                    res.json({
                        success:true,
                        message:"user successfully login",
                        token:token
                    })
                }
            }
        })
    });

    //------------------------- Send mail -------------------------

    api.post('/sendmail',function(req,res){

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing

        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service:'gmail',
                host: 'SMTP',
                port: 25,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: config.email, // generated ethereal user
                    pass: config.pass // generated ethereal password
                },
                tls:{
                    rejectUnauthorized:false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Rahul Sonone" <abc@tecture.in>', // sender address
                to: 'rahul.sonone@tecture.in', // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world?', // plain text body
                html: '<b>Hello world?</b>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.end("sent"); 
            });
        });
    });


    // ----------------- file upload -----------------//





// middleware check token is valid or not

    api.use(function(req,res,next){

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        // check token exist

        if(token){
            
            jsonwebtoken.verify(token,secretKey,function(err,decoded){

                if(err){

                    res.status(403).send({success:false,message:"Failed to authenticate user"});
                }else{

                    req.decoded = decoded;

                    next();
                }
            })
        }else{
            res.status(403).send({success:false,message:"No token provided"});
        }
    });


    // redirect to home page after login

   /* api.get('/',function(req,res){

        res.json('hello rahul');
    });
    */


    api.route('/').post(function(req,res){

        var story = new Story({

            creator:req.decoded.id,
            content:req.body.content,

        });
        story.save(function(err){

            if(err){
                res.send(err);
                return
            }
            res.json({message:"New story created"});
        })
    }).get(function(req,res){

        Story.find({creator:req.decoded.id},function(err,stories){

            if(err){

                res.send(err);
            }

            res.json(stories);
        })
    });
    
    api.get('/joincollection',function(req,res){

        Story.find().populate({path:'creator',select:'username'}).exec( function(err, stories){

            if(err){
                res.send(err);
            }
            res.json(stories);
        });
    });



    return api;
}


