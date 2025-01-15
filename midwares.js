const key = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Authentication required');
    }

    // Decode Base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Check username and password
    const validUsername = "rohitnode"; // Set your username
    const validPassword = "021108"; // Set your password

    if (username === validUsername && password === validPassword) {
        next(); // Proceed to the next middleware or route
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).send('Invalid credentials');
    }

};

const testware = (req,res,next)=>{
    if(!req.query.age){
        res.send('<h1>Enter Age</h1>')
    }
    else{
        next()
    }
}
  

module.exports={key,testware}
