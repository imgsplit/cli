import yargs from 'yargs';
import {imgsplit, ImgSplitOption, ItemOption} from "@imgsplit/core";
import path from 'upath';
import {existsSync, readFileSync} from "node:fs";
import {saveFile} from "../utils/fileutil";
import ora from 'ora';
import {welcome} from "../utils/logutil";
import {fileTypeFromBuffer} from "file-type";

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
        m: {type: 'array', alias: 'item'},
        'disable-display': {type: 'boolean'},
    })
    .demandCommand(1);

const spinner = ora({
    text: 'init',
});


export async function main(args: string | string[]): Promise<boolean> {
    const arg = await parser.parse(args);

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
            const itemStr = arg.m[i] as string;
            let item: string[];
            if (/\s/ig.test(itemStr))
                item = itemStr.trim().split(/\s/ig);
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
    if (!arg.disableDisplay)
        welcome();

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
        if (!arg.disableDisplay)
            spinner.fail('input file is empty!');
        return false;
    }
    if (!arg.disableDisplay) {
        console.log(`Options:`)
        console.log(`${JSON.stringify(options, null, 2)}`);
    }
    if (!existsSync(options.input)) {
        if (!arg.disableDisplay)
            spinner.fail(`file not exists! ---> ${options.input}`);
        return false;
    }


    if (arg.o) {
        options.ouput = arg.o;
    } else if (arg._.length > 1 && typeof (arg._[arg._.length - 1]) === 'string') {
        options.ouput = arg._[arg._.length - 1] as string;
    } else {
        const inputFileName = path.trimExt(path.basename(options.input));
        options.ouput = path.joinSafe(path.dirname(options.input), `${inputFileName}-splitted/`)
    }

    const parsed = path.parse(options.ouput);

    if (!parsed.ext || !parsed.name) {
        const buffer = readFileSync(options.input);
        const typeResult = await fileTypeFromBuffer(buffer);

        options.ouput = path.joinSafe(options.ouput, `#.${typeResult.ext}`);
    }

    if (!arg.disableDisplay)
        spinner.start('splitting');

    options.forceOuputDataURL = false;

    options.src = options.input;
    const splitResult = await imgsplit(options as ImgSplitOption);

    if (!arg.disableDisplay) {
        spinner.text = 'saving';
        spinner.render();
    }

    const saveResult = await saveFile(options.ouput, splitResult);
    if (saveResult.success) {
        if (!arg.disableDisplay) {
            spinner.succeed(`success!`)
            console.log('output dir:    ' + path.resolve(process.cwd(), path.dirname(options.ouput)));
        }
    } else {
        if (!arg.disableDisplay) {
            spinner.fail('failed!')
            console.log(`${saveResult.msg}`);
        }
        return false;
    }

    return true;
}
