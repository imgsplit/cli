#!/usr/bin/env node
export * from './imgsplit';
import {main} from "./imgsplit";
import {hideBin} from "yargs/helpers";

main(hideBin(process.argv));