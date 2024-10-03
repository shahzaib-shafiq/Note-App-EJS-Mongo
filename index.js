const express = require('express')
const path=require('path')
const app = express()
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
const userModel=require('./models/user')
const { name } = require('ejs')
const user = require('./models/user')

app.get('/', function (req, res) {
  res.render('index')
})

// app.get('/read', async function (req, res) {
   
//    let Users= await user.find()
//    console.log(Users)
//     res.render('read',{Users})
//   })
app.get('/read', async function (req, res) {
  try {
    let users = await user.find();
    console.log(users);
    res.render('read', { users: users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


  app.post('/create', async function (req, res) {
    let {Name,Email,Image}=req.body
    let createdUser=await userModel.create({
        name:Name,
        email:Email,
        image:Image


    })
    res.redirect("/read")
  })

  app.get('/delete/:id', async function (req, res) {
  
    let deleteUser=await userModel.findOneAndDelete({
        _id:req.params.id


    })
    res.redirect("/read")
  })

  
app.listen(3000)