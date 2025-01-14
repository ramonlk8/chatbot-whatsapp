
// leitor de qr code
const qrcode = require('qrcode-terminal');
const process = require('node:process');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const client = new Client();
const QRCode = require('qrcode');

//Express
const express = require('express');
const path = require('path');
const app = express()
const port = 10000;



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
})


app.get('/status', async (req, res) => {
    const status = await client.getState();
    res.send(`
   <!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Status do Usuário</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #ceb9cc;
    }
    .status {
      padding: 20px;
      border-radius: 10px;
      font-size: 20px;
      font-weight: bold;
      color: white;
    }
    .ativo {
      background-color: #00bfff; /* Azul */
    }
    .inativo {
      background-color: #ff1414; /* Rosa */
    }
  </style>
</head>
<body>
  <div class="status ativo" id="userStatus">
    Usuário Conectado
  </div>

  <script>
      const statusElement = document.getElementById('userStatus');
      if (${status} == 'CONNECTED') {
        statusElement.classList.remove('inativo');
        statusElement.classList.add('ativo');
        statusElement.textContent = 'Usuário Conectado';
      } else {
        statusElement.classList.remove('ativo');
        statusElement.classList.add('inativo');
        statusElement.textContent = 'Usuário Desconectado';
      }
  </script>
  <a href="/">Voltar</a>
</body>
    <footer>
        <p>Criado por Ramon Muniz &#127874;</p>
    </footer>
</html>
`);

})
app.get('/inicia', async (req, res) => {
    // serviço de leitura do qr code
    client.on('qr', async qr => {
        try {
            const qrCode = await QRCode.toDataURL(qr);
            res.send(`
                    <!DOCTYPE html>
                    <html lang="pt-Br">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>QR Code Gerado</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                text-align: center;
                                margin-top: 50px;
                            }
                            img {
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>QR Code Gerado</h1>
                        <img src="${qrCode}" alt="QR Code">
                        <p>Conteúdo: Qrcode Whatsapp Bot</p>
                        <a href="/">Voltar</a>
                    </body>
                        <footer>
        <p>Criado por Ramon Muniz &#127874;</p>
    </footer>
                    </html>
                `);
        } catch (error) {
            process.on('unhandledRejection', (reason, promise) => {
                console.log('Unhandled Rejection at:', promise, 'reason:', reason);
                client.off();
            });
        }
    });

})

app.get('/reseta', (req, res) => {
    res.send('Resetando Bot');
    client.destroy();
    IniciarBot();
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado no celular da Emily.');
});
// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil
client.on('message', async msg => {

    var contact = await msg.getContact(); //Pegando o contato
    var name = contact.pushname; //Pegando o nome do contato

    if (msg.body.match(/(menu|Menu|dia|tarde|noite|olá|Olá|Oi|entregam|podemos)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await client.sendMessage(msg.from, 'Olá! Bem vindo a BenditoDoce!\n' + name.split(" ")[0] + ', Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Kit de Festa\n2 - Valores dos Bolos Temáticos\n3 - Valores dos Bolos Comuns\n4 - Valores Salgados e Doces'); //Primeira mensagem de texto
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(5000); //Delay de 5 segundos
        console.log(`Cliente se conectou correlation_id: ${chat.id.user}`);


    }

    if (msg.body !== null && (msg.body === '1' || msg.body === 'Kit de Festa' || msg.body === 'Kit de festa') && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        const imagePaths = ['./img/kits/minivulcao.jpg', './img/kits/IMG_2427.JPG', './img/kits/IMG_2428.JPG', './img/kits/IMG_2429.JPG'];
        var numeroKits = 0;
        for (const path of imagePaths) {
            numeroKits = numeroKits + 1;
            enviarImagem(path, `Aqui está o Kit - ${numeroKits}`)
        }
        console.log(`Cliente escolheu essa opção 1, correlation_id: ${chat.id.user}`);

    }

    if (msg.body !== null && (msg.body === '2' || msg.body === 'Valores dos Bolos Temáticos') && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);

        const imagePath = './img/boloTematico/IMG_2433.JPG'; // Exemplo de arquivo local

        enviarImagem(imagePath, 'Aqui está o Cardápio do Bolo Temático')
        console.log(`Cliente escolheu essa opção 2, correlation_id: ${chat.id.user}`);
    }

    if (msg.body !== null && (msg.body === '3' || msg.body === 'Valores dos Bolos Comuns') && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);

        const imagePath = './img/boloComum/IMG_8403.jpg';
        enviarImagem(imagePath, '*Bolo Comum - 11cm:*\n\nBolo sem recheio R$15,00\nBolo com recheio R$20,00');
        console.log(`Cliente escolheu essa opção 3, correlation_id: ${chat.id.user}`);
    }

    if (msg.body !== null && (msg.body === '4' || msg.body === 'Valores Salgados e Doces') && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Valores dos doces e salgados\n\n30 unidades: *R$30,00*\n50 unidades: *R$55,00*\n100 unidades:*R$100,00*\n200 unidades: *R$170,00*\n500 unidades: *R$380,00*\n1000 unidades: *R$800,00*');
        console.log(`Cliente escolheu essa opção 4, correlation_id: ${chat.id.user}`);
    }

    async function enviarImagem(path, legenda) {
        try {
            const media = MessageMedia.fromFilePath(path);
            await client.sendMessage(msg.from, media, { caption: legenda });
            console.log('Imagem enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
        }
    }

});


