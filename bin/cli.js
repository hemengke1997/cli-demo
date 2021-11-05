#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const inquirer_1 = __importDefault(require("inquirer"));
const Generator_1 = __importDefault(require("../lib/Generator"));
const program = new commander_1.default.Command();
program
    .command("create <app-name>")
    .description("create a new project")
    .option("-f, --force", "overwrite target directory if it exist")
    .action((name, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("name:", name, "options:", options);
    const cwd = process.cwd();
    const targetAir = path_1.default.join(cwd, name);
    if (fs_extra_1.default.existsSync(targetAir)) {
        if (options.force) {
            yield fs_extra_1.default.remove(targetAir);
        }
        else {
            let { action } = yield inquirer_1.default.prompt([
                {
                    name: "action",
                    type: "list",
                    message: "Target directory already exists Pick an action:",
                    choices: [
                        {
                            name: "Overwrite",
                            value: true,
                        },
                        {
                            name: "Cancel",
                            value: false,
                        },
                    ],
                },
            ]);
            if (!action) {
                return;
            }
            console.log(`\rRemoving...`);
            yield fs_extra_1.default.remove(targetAir);
        }
    }
    const generator = new Generator_1.default(name, targetAir);
    generator.create();
}));
program.on("--help", () => {
    console.log("\r\n" + figlet_1.default.textSync("hemengke"));
    console.log(`\r\n Run ${chalk_1.default.cyan(`hemengke <command> --help`)} show details\r\n`);
});
program
    .version(`v${require("../package").version}`)
    .usage("<command> [option]");
program.parse(process.argv);
