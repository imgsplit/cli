import {mkdirSync, writeFile} from "node:fs";
import {OuputDataType} from "@imgsplit/core";
import path from "upath";

export type resultType = {
    success: boolean,
    msg?: string
}

export async function saveFile(distPath: string, result: OuputDataType[]): Promise<resultType> {
    const dir = distPath;
    // console.debug(`dir: ${dir}`)
    mkdirSync(dir, {
        recursive: true
    });

    for (let i = 0; i < result.length; i++) {
        const filename = path.join(dir, i + '.png');
        // console.debug(filename)
        const r = await save(filename, result[i].buffer);
        if (!r.success) return r;
    }

    return {success: true};
}

async function save(filename: string, buffer: Buffer): Promise<resultType> {
    return new Promise(resolve => {
        writeFile(filename, buffer, {}, (err) => {
            if (err) {
                resolve({
                    success: false,
                    msg:err.message
                });
            } else {
                resolve({
                    success: true,
                });
            }
        })
    })
}