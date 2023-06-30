var arrayObjetos = [
    { id: 1, nome: 'João', email: 'joao@gmail.com' },
    { id: 2, nome: 'Maria', email: 'maria@gmail.com' },
    { id: 3, nome: 'André', email: 'andre@gmail.com' },
    // outros objetos...
  ];
  
  var objetoEncontrado = arrayObjetos.find(function(objeto) {
    console.log(objeto.email);
    return objeto.email === 'andre@gmail.com';
  });
  
  console.log(objetoEncontrado);
  