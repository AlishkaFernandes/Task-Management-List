import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "",
  port: 5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  let item=await db.query("select * from items order by title asc");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: item.rows,
  });
});

app.post("/add",async(req, res) => {
  try{  const item = req.body.newItem;
    let itemtitle= await db.query("insert into items(title) values($1)",[item]);
    res.redirect("/");
  }
  catch{
    console.log(err)
  }

});

app.post("/edit",async(req, res) => {

  try{  
    let updatedid=req.body.updatedItemId;
    let updatedtitle=req.body.updatedItemTitle
    let update=await db.query("update items set title=$1 where id=$2",[updatedtitle,updatedid])
    res.redirect("/")
  }
  catch{
    console.log(err)
  }

});

app.post("/delete",async(req, res) => {
  try{
  let deleteid=req.body.deleteItemId
  let deletedelement=await db.query("delete from items where id=$1",[deleteid])
  res.redirect("/");}
  catch{
    console.log(err)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
