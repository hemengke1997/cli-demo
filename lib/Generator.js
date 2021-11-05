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
const http_1 = require("./http");
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
class Generator {
    constructor(name, targetDir) {
        this.name = name;
        this.targetDir = targetDir;
    }
    getRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            const repoList = yield wrapLoading(http_1.getRepoList, "waiting fetch template");
            if (!repoList)
                return;
            // 过滤我们需要的模板名称
            const repos = repoList.map((item) => item.name);
            // 2）用户选择自己新下载的模板名称
            const { repo } = yield inquirer_1.default.prompt({
                name: "repo",
                type: "list",
                choices: repos,
                message: "Please choose a template to create project",
            });
            // 3）return 用户选择的名称
            return repo;
        });
    }
    getTag(repo) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1）基于 repo 结果，远程拉取对应的 tag 列表
            const tags = yield wrapLoading(http_1.getTagList, "waiting fetch tag", repo);
            if (!tags)
                return;
            // 过滤我们需要的 tag 名称
            const tagsList = tags.map((item) => item.name);
            // 2）用户选择自己需要下载的 tag
            const { tag } = yield inquirer_1.default.prompt({
                name: "tag",
                type: "list",
                choices: tagsList,
                message: "Place choose a tag to create project",
            });
            // 3）return 用户选择的 tag
            return tag;
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = yield this.getRepo();
            const tag = yield this.getTag(repo);
            console.log('用户选择了，repo=' + repo + '，tag=' + tag);
        });
    }
}
function wrapLoading(fn, message, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = ora_1.default(message);
        spinner.start();
        try {
            const result = yield fn(...args);
            spinner.succeed();
            return result;
        }
        catch (err) {
            spinner.fail("Request failed, refetch...");
        }
    });
}
exports.default = Generator;
