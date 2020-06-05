import express from 'express';

const app = express();


app.get('/users', (request, response)=>{
    response.json({"Lista de usuários aqui" : ["Gabriel","Douglas","Antônio"]});
});

app.listen(3333);