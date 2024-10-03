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

  app.get("/edit/:userid",async(req,res)=>{
let user=await userModel.findOne({_id:req.params.userid});
res.render('edit',{user})
  })
  
  app.post("/update/:userid", async (req, res) => {
    const { Name, Email, Image } = req.body;

    try {
        // Check if the user ID is provided
        if (!req.params.userid) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Attempt to update the user
        const user = await userModel.findOneAndUpdate(
            { _id: req.params.userid },
            { name:Name, email:Email,image: Image },
            { new: true, runValidators: true } 
        );

        // Check if the user was found and updated
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        
        res.redirect("/read");
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "An error occurred while updating the user" });
    }
});


app.listen(3000)