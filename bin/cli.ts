#! /usr/bin/env node

import commander from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import Generator from "../lib/Generator";

const program = new commander.Command();

program
  .command("create <app-name>")
  .description("create a new project")
  .option("-f, --force", "overwrite target directory if it exist")
  .action(async (name, options) => {
    console.log("name:", name, "options:", options);
    const cwd = process.cwd();
    const targetAir = path.join(cwd, name);

    if (fs.existsSync(targetAir)) {
      if (options.force) {
        await fs.remove(targetAir);
      } else {
        let { action } = await inquirer.prompt([
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
        await fs.remove(targetAir);
      }
    }

    const generator = new Generator(name, targetAir);

    generator.create();
  });

program.on("--help", () => {
  console.log("\r\n" + figlet.textSync("hemengke"));
  console.log(
    `\r\n Run ${chalk.cyan(`hemengke <command> --help`)} show details\r\n`
  );
});

program
  .version(`v${require("../package").version}`)
  .usage("<command> [option]");

program.parse(process.argv);
