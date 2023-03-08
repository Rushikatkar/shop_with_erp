//var con = require('./connection')
var express = require('express');
var bodyParser = require('body-parser');
var mysql= require('mysql2');
var session = require('express-session');

var con =mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"password",
    database: "erp"
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(express.static(__dirname+'/assets'));

app.get('/test.html',function(req,res){
    res.sendFile(__dirname+'/test.html')
});

app.get('/index.html',function(req,res){
    res.sendFile(__dirname+'/index.html')
})

app.get('/About-us.html',function(req,res){
    res.sendFile(__dirname+'/About-us.html')
})


//contact page js
app.get('/contact.html',function(req,res){
    res.sendFile(__dirname+'/contact.html')
});

app.get('/payment.html',function(req,res){
    res.sendFile(__dirname+'/payment.html')
});
app.post('/contact.html',function(req,res){
    var name = req.body.name;
    var subject = req.body.subject;
    var email = req.body.email;
    var massage = req.body.massage;
    console.log(name,subject,email,massage);
    con.connect(function(error){

       if(error) throw error;

        var sql = "INSERT INTO contact(name,subject, email, massage)VALUES('"+name+"','"+subject+"','"+email+"','"+massage+"')";
        con.query(sql,function(error,result){
            if(error) throw error;

            res.send('Your Response is Submitted ');
        });

    })
});
//shop page js
app.get('/shop.html',function(req,res){
    if(req.session.loggedin){
        res.sendFile(__dirname+'/shop.html')
    }else{
        res.send(`You must login to view this page.<br><A href="login.html">Click here to Login</a>`);
    }
})
app.post('/test.html',function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    console.log(name,email,password);
    con.connect(function(error){

       if(error) throw error;

        var sql = "INSERT INTO userinfo(name, email, password)VALUES('"+name+"','"+email+"','"+password+"')";
        con.query(sql,function(error,result){
            if(error) throw error;

            res.send('Student Registration successfull ');
        });

    })
});




app.get('/Sign-in.html', function(req, res){
    res.redirect('/login.html');
});

app.get('/login.html', function(request, response) {
	/*Render login template*/
	response.sendFile(__dirname + ('/login.html'));
});



app.post('/login.html', function(request, response) {
	/*Capture the input fields*/
	let email = request.body.email;
	let password = request.body.password;
	/*Ensure the input fields exists and are not empty*/
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		con.query('SELECT * FROM userinfo WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			/*If there is an issue with the query, output the error*/
			if (error) throw error;
			/*If the account exists*/
			if (results.length > 0) {
				/*Authenticate the user*/
				request.session.loggedin = true;
				request.session.email = email;
				/*Redirect to home page*/
				response.redirect('/shop.html');
			} else {
				response.send('Incorrect email and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter email and Password!');
		response.end();
	}
});

// app.set('view engine','ejs');

//  app.get('/',function(req,res){
//     res.sendFile(__dirname+'/purchase.html');
//  });

 //new update
//  const { commit } = require('./connection');
//  app.set('view engine','ejs');

//  app.post('/',function(req,res){
//    var item = req.body.item;
//     var quantity = req.body.quantity;
//     var price = req.body.price;
    
     

//        var sql = "INSERT INTO shop(item, quantity, price) VALUES('"+item+"','"+quantity+"','"+price+"')";

//        con.query(sql,function(error,result){
//         if(error)throw error;
//         res.redirect('/shop');
//         // res.send('Student registration sucessfull'+result);
//        });
//      });
//  app.get('/shop',function(req,res){
//     con.connect(function(error){
//         if(error) console.log(error);

//         var sql = "select * from shop";

//         con.query(sql,function (error,result){
//             if (error) console.log(error);
//             res.render(__dirname+"/shop",{shop:result});

//         });
//     });
//  });


app.listen(3000);

//https://codeshack.io/basic-login-system-nodejs-express-mysql/