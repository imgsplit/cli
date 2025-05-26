import {expect, it} from "vitest";
import {main} from "../src";
import {readdirSync} from "node:fs";

const globalInputDir = 'test/assets/';
const globalOutputDir = 'test/.out/';

export async function createTest(testName: string, args: string,resultCount:number) {
    testName = testName.replace(/\s/ig, '-');

    const ouputDir = `${globalOutputDir}/${testName}/`;

    args = args.replace('{{inputDir}}',globalInputDir);
    args = args.replace('{{outputDir}}',ouputDir);

    it(testName, async () => {
        const r = await main(`${args} --disable-display`);

        expect(r).toBe(true);
        expect(readdirSync(ouputDir).length).toBe(resultCount);

    })
}