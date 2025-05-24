#!/usr/bin/env node
import yargs from 'yargs';
import {imgsplit, ImgSplitItemOption, ImgSplitOption} from "@imgsplit/core";
import {hideBin} from "yargs/helpers";
import path from 'upath';
import {existsSync} from "node:fs";
import {saveFile} from "../utils/fileutil";
import ora from 'ora';
import {welcome} from "../utils/logutil";

export type SplitOption = Partial<ImgSplitOption> & {
    input?: string
    ouput?: string
}


const parser = yargs()
    .usage('Usage:  imgsplit xxx.png 256 ./savepath/')

    .example('imgsplit xxx.png -h 256 ./savepath/', 'by item height:256')
    .example('imgsplit -i xxx.png -c 10 -o ./savepath/', 'by item count:10')
    .example('imgsplit -i xxx.png -c 10 -o ./savepath/', 'by item count:10')

    .options({
        i: {type: 'string', alias: 'input', description: 'source image'},
        o: {type: 'string', alias: 'output', description: 'dist path'},
        h: {type: 'number', alias: 'item-height', description: 'item height'},
        c: {type: 'number', alias: 'count', description: 'by count'},
        m: {type: 'string', alias: 'items'},
    });

const spinner = ora({
    text: 'init',
    suffixText:'...'
});


(async () => {
    welcome();
    const arg = await parser.parse(hideBin(process.argv));

    let options: SplitOption = {};

    if (arg.i) {
        options.input = arg.i;
    } else if (arg._) {
        options.input = arg._[0] as string;
    }

    if (arg.h) {
        options.height = arg.h;
    } else if (arg._ && arg._.length >= 2) {
        options.height = arg._[1] as number;
    }else{
        options.height = 256;
    }

    if (arg.c) {
        options.count = arg.c;
    }

    if (arg.m) {
        options.items = [];
        console.log(arg.m);
        const itemArr: string[] = arg.m.split(';');

        for (let i = 0; i < itemArr.length; i++) {
            console.log(itemArr[i]);
            // const item:number[] = arg.item[i] as number[];
            // const itemOption:Partial<ImgSplitItemOption>={};
            // if(item)
            //
            // options.items.push(itemOption as ImgSplitItemOption);
        }

    }
    if (!existsSync(options.input)) {
        if (options.input) {
            spinner.fail('file not exists!');
        } else {
            spinner.fail('input file is empty!');
        }
        return;
    }

    options.input = path.normalize(options.input);

    if (arg.o) {
        options.ouput = arg.o;
    } else if (arg._.length > 1 && typeof (arg._[arg._.length - 1]) === 'string') {
        options.ouput = arg._[arg._.length - 1] as string;
    } else {
        const inputFileName = path.trimExt(path.basename(options.input));

        options.ouput = path.joinSafe(path.dirname(options.input), `${inputFileName}-splitted/`)
    }
    console.debug(`options : ${JSON.stringify(options)}`);

    spinner.start('splitting');

    options.src = options.input;
    const result = await imgsplit(options as ImgSplitOption);

    spinner.text = 'saving';
    spinner.render();

    await new Promise(res=>setTimeout(res, 100));

    const r = await saveFile(options.ouput, result);
    if (r.success) {
        spinner.succeed(`success!`)
        console.log(`${path.join(path.normalize(process.cwd()),options.ouput)}`);
    } else {
        spinner.fail('failed!')
        console.log(`${r.msg}`);
    }


})();