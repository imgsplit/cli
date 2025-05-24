#!/usr/bin/env node
import yargs from 'yargs';
import {imgsplit, ItemOption, ImgSplitOption} from "@imgsplit/core";
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
    .usage('Usage:  imgsplit ./xxx.png 256 ./savepath/')

    .example('imgsplit ./xxx.png -h 256 ./savepath/', 'by item height:256')
    .example('imgsplit ./xxx.png -c 10 -o ./savepath/', 'by item count:10')

    .options({
        o: {type: 'string', alias: 'output', description: 'dist path'},
        h: {type: 'number', alias: 'height', description: 'by height'},
        c: {type: 'number', alias: 'count', description: 'by count'},
        m: {type: 'array', alias: 'items'},
    })
    .demandCommand(1);

const spinner = ora({
    text: 'init',
});


(async () => {
    welcome();
    const arg = await parser.parse(hideBin(process.argv));

    let options: SplitOption = {};

    if (arg._) {
        options.input = arg._[0] as string;
    }


    if (arg.c) {
        options.count = arg.c;
    }

    if (arg.m) {
        options.items = [];
        for (let i = 0; i < arg.m.length; i++) {
            const itemObj: Partial<ItemOption> = {};
            const itemStr = (arg.m[i] as string);
            let item: string[];
            if (/[,，]/ig.test(itemStr))
                item = itemStr.split(/[,，]/ig);
            else
                item = [itemStr];

            switch (item.length) {
                case 1:
                    itemObj.y = parseInt(item[0]);
                    break;
                case 2:
                    itemObj.y = parseInt(item[0]);
                    itemObj.height = parseInt(item[1]);
                    break;
                case 4:
                    itemObj.x = parseInt(item[0]);
                    itemObj.y = parseInt(item[1]);
                    itemObj.width = parseInt(item[2]);
                    itemObj.height = parseInt(item[3]);
                    break;
            }

            options.items.push(itemObj as ItemOption);
        }

    }

    if (arg.h) {
        options.height = arg.h;
    } else if (arg._ && arg._.length >= 2 && (typeof arg._[1]) === 'number') {
        options.height = arg._[1] as number;
    } else if (!arg.c && !arg.m) {
        options.height = 256;
    }


    if (options.input) {
        options.input = path.normalize(options.input);
    } else {
        spinner.fail('input file is empty!');
        return;
    }

    console.log(`Options:`)
    console.log(`${JSON.stringify(options, null, 2)}`);

    if (!existsSync(options.input)) {
        spinner.fail(`file not exists! ---> ${options.input}`);
        return;
    }


    if (arg.o) {
        options.ouput = arg.o;
    } else if (arg._.length > 1 && typeof (arg._[arg._.length - 1]) === 'string') {
        options.ouput = arg._[arg._.length - 1] as string;
    } else {
        const inputFileName = path.trimExt(path.basename(options.input));
        options.ouput = path.joinSafe(path.dirname(options.input), `${inputFileName}-splitted/`)
    }

    spinner.start('splitting');

    options.src = options.input;
    const splitResult = await imgsplit(options as ImgSplitOption);

    spinner.text = 'saving';
    spinner.render();

    await new Promise(res => setTimeout(res, 100));

    const saveResult = await saveFile(options.ouput, splitResult);
    if (saveResult.success) {
        spinner.succeed(`success!`)
        console.log(`${path.join(path.normalize(process.cwd()), options.ouput)}`);
    } else {
        spinner.fail('failed!')
        console.log(`${saveResult.msg}`);
    }


})();