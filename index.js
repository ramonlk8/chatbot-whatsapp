
// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const client = new Client();
// serviço de leitura do qr code
client.on('qr', qr => {
    console.log(qr);
    qrcode.generate(qr, {small: true});
});
// apos isso ele diz que foi tudo certo
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

    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|entregam|podemos)/i) && msg.from.endsWith('@c.us')) {
        
        const chat = await msg.getChat();
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await client.sendMessage(msg.from,'Olá! Bem vindo a BenditoDoce!\n'+ name.split(" ")[0] + ', Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Kit de Festa\n2 - Valores dos Bolos Temáticos\n3 - Valores dos Bolos Comuns\n4 - Valores Salgados e Doces'); //Primeira mensagem de texto
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