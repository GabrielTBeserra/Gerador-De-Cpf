const puppeteer = require('puppeteer');
const generatorButtonSelector = "#bt_gerar_cpf";
const args = process.argv;
const generatedCpfs = [];
const fs = require('fs');
let isFormated;

const generate = async () => {
    console.log("Gerando....");
    console.time("time")
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.4devs.com.br/gerador_de_cpf');

    const getSize = () => {
        let size = args.filter((arg) => {
            return arg.includes("-size:");
        });

        if (size.length == 0) {
            return 1;
        }

        return size[0].split(":")[1];
    }

    const generatePromisse = (page) => new Promise((resolve, reject) => {

        setTimeout(async () => {
            const element = await page.$("#texto_cpf");
            let text = await page.evaluate(element => element.textContent, element);
            if (isFormated) {
                text = text.replace(/\./gi, "")
                text = text.replace(/\-/gi, "")
            }
            resolve(text)
        }, 1000)
    })

    for (let i = 0; i < getSize(); i++) {
        await page.click(generatorButtonSelector)
        generatedCpfs.push(await generatePromisse(page))
    }

    await fs.writeFileSync('CPFS.txt', generatedCpfs.join('\n'));
    console.timeEnd("time")
    console.log(generatedCpfs)
    await browser.close();
}


const checkFormated = () => {
    let size = args.filter((arg) => {
        return arg.includes("-unformated");
    });

    if (size.length == 1) {
        isFormated = true;
        return;
    }

    isFormated = false;
}

checkFormated();
generate();