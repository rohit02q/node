const express = require('express')
const path = require('path')
const fs = require('fs');
const midware =require('./midwares.js')
const li = require('./data.js');
const api= require('./apiLines.json')
const cors = require('cors')
const PORT = process.env.PORT || 3000;
const app = express();
const html = path.join(__dirname,'public');

  app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs')

  app.get('/',(req,res)=>{
       
        res.sendFile(`${html}/index.html`)
       
    })
    
    app.use(cors())
app.get('/skill',midware.testware,(req,res)=>{
    res.render('skill');
})
app.get('/about',(req,res)=>{
    res.sendFile(`${html}/about.html`)
})






//form  

 
app.get('/form', (req, res) => {
    res.sendFile(`${html}/form.html`);
});


app.get('/seeData',midware.key, (req, res) => {
    res.sendFile(`${html}/alldata.html`);
});


app.post('/data', (req, res) => {
    res.redirect('/form');
    const data = req.body;
    li.arr.push(data); // Update runtime array 


    const updatedContent = `let arr = ${JSON.stringify(li.arr, null, 2)};\nmodule.exports = { arr };`;
    fs.writeFile('./data.js', updatedContent, (err) => {
        if (err) {
            console.error('Error writing to data.js:', err);
            return res.status(500).send('Error saving data');
        }
        console.log('Updated data.js file:', li.arr);
        res.redirect('/');
    });
});





// API to fetch all data
app.get('/api/data', (req, res) => {
    res.json(li.arr);
});

// API to delete an entry
app.delete('/api/data/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < li.arr.length) {
        li.arr.splice(index, 1);
        const updatedContent = `let arr = ${JSON.stringify(li.arr, null, 2)};\nmodule.exports = { arr };`;
        fs.writeFile('./data.js', updatedContent, (err) => {
            if (err) {
                console.error('Error writing to data.js:', err);
                return res.status(500).send('Error saving data');
            }
            res.sendStatus(200);
        });
    } else {
        res.status(400).send('Invalid index');
    }
});

// API to edit an entry
app.put('/api/data/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const { name, phone } = req.body;
    if (index >= 0 && index < li.arr.length) {
        li.arr[index] = { name, phone };
        const updatedContent = `let arr = ${JSON.stringify(li.arr, null, 2)};\nmodule.exports = { arr };`;
        fs.writeFile('./data.js', updatedContent, (err) => {
            if (err) {
                console.error('Error writing to data.js:', err);
                return res.status(500).send('Error saving data');
            }
            res.sendStatus(200);
        });
    } else {
        res.status(400).send('Invalid index');
    }
});
















app.get('/quotes',(req,res)=>{
    res.sendFile(`${html}/quotes.html`)
})
app.get('/api',midware.key,(req,res)=>{
    res.send(api)
})

app.get('/api/:type', (req, res) => {
    const { type } = req.params; 
  
    
    if (api[type]) {
      res.send({ [type]: api[type] }); 
    } else {
      res.status(404).json({ error: "Type not found" }); 
    }
  });

app.get('/other', (req, res) => {
   
    res.redirect('https://rohiz.pages.dev/');
  });
  

app.use(express.static(html))
app.use((req,res)=>{
    res.sendFile(`${html}/404.html`)
})















app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
