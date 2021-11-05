import { getRepoList, getTagList } from "./http";
import ora from "ora";
import inquirer from "inquirer";

class Generator {
  name: string;
  targetDir: string;

  constructor(name: string, targetDir: string) {
    this.name = name;
    this.targetDir = targetDir;
  }

  async getRepo() {
    const repoList = await wrapLoading(getRepoList, "waiting fetch template");

    if (!repoList) return;

    // 过滤我们需要的模板名称
    const repos = (repoList as unknown as any[]).map((item) => item.name);

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "Please choose a template to create project",
    });

    // 3）return 用户选择的名称
    return repo;
  }

  async getTag(repo: any) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, "waiting fetch tag", repo);
    if (!tags) return;

    // 过滤我们需要的 tag 名称
    const tagsList = (tags as unknown as any[]).map((item) => item.name);

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: "tag",
      type: "list",
      choices: tagsList,
      message: "Place choose a tag to create project",
    });

    // 3）return 用户选择的 tag
    return tag;
  }

  async create() {
    const repo = await this.getRepo();
    const tag = await this.getTag(repo)
     
    console.log('用户选择了，repo=' + repo + '，tag='+ tag)
  }
}

async function wrapLoading(fn: any, message: string, ...args: any) {
  const spinner = ora(message);

  spinner.start();

  try {
    const result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (err) {
    spinner.fail("Request failed, refetch...");
  }
}

export default Generator;
