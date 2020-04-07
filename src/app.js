const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID.'});
  }
  return next();
}

app.get("/repositories", (request, response) => {  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  //recebe parâmetros do request body
  const { title, url, techs } = request.body;

  //cria um novo objeto de repositório e recebe os parâmetros desestruturados
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  //adiciona no array de repositórios o repositório requisitado
  repositories.push(repository);

  //quando um novo repositório é adicionado o mesmo é retornado
  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  //recebe o id como um route params
  const { id } = request.params;
  //recebe a request body com os dados da atualização no corpo da requisição
  const { title, url, techs } = request.body;
  //busca no vetor de repositórios se existe algum repositório com o id requisitado
  //se houver seu índice é armazenado para que possa ser atualizado na posição correta
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  //quando o repositório não é encontrado é retornado índice -1 se esse for o valor retornado
  //exibe uma mensagem de erro
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'});
  }

  //caso o repositório seja encontrado um novo objeto é construído
  const repository = {
    ...repositories[repositoryIndex],
     title,
     url,
     techs
  }
  /** Outro método
     const repository = {
     id,
     title,
     url,
     techs,
     likes: repositories[repositoryIndex].likes,
  }
  */
  //em seguida é atualizado na posição correta conforme repositoryIndex
  repositories[repositoryIndex] = repository;
  //se tudo ocorrer bem retorna o objeto atualizado
  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  //recebe o id como um route params
  const { id } = request.params;
  //busca no vetor de repositórios se existe algum repositório com o id requisitado
  //se houver seu índice é armazenado para que possa ser deletado na posição correta
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  //quando o repositório não é encontrado é retornado índice -1 se esse for o valor retornado
  //exibe uma mensagem de erro
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'});
  }
  
  //em seguida é usamos a função slice para remover parte do objeto, os parâmetros são
  //posição e quantas posições a partir dele
  repositories.splice(repositoryIndex, 1);

  //se tudo ocorrer bem não retorna nada, apenas um status, no nosso caso 204
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  //recebe o id como um route params
  const { id } = request.params;
  
  //busca no vetor de repositórios se existe algum repositório com o id requisitado
  //se houver seu índice é armazenado para que possa ser incrementado o like na posição correta
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  //quando o repositório não é encontrado é retornado índice -1 se esse for o valor retornado
  //exibe uma mensagem de erro
  if(repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository not found.'});
  }

  //caso o repositório seja encontrado incrementa o atributo likes na posição correta 
  //conforme repositoryIndex
  repositories[repositoryIndex].likes += 1;
  //se tudo ocorrer bem retorna o objeto atualizado
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
