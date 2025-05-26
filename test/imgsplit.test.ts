import {createTest} from "./utils";

createTest(
    'with height default',
    `{{inputDir}}test.jpg {{outputDir}}`,
    16
);

createTest(
    'with height custom',
    `{{inputDir}}test.jpg 512 {{outputDir}}`,
    8
);

createTest(
    'with count',
    `{{inputDir}}test.jpg -c 5 {{outputDir}}`,
    5
);

createTest(
    'with items single param',
    `{{inputDir}}test.jpg {{outputDir}} -m 0 -m 1024`,
    2
);

createTest(
    'with items 2 params',
    `{{inputDir}}test.jpg {{outputDir}} -m 0,512 -m 2048,1024`,
    2
);

createTest(
    'with items 4 params',
    `{{inputDir}}test.jpg {{outputDir}} -m 0,0,256,256 -m 128,512,256,512`,
    2
);