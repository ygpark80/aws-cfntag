import fs from "fs"
import path from "path"
import { Command } from "commander"
import { STS } from "@aws-sdk/client-sts"
import { CloudFormation, ListStacksOutput, StackSummary, StackStatus } from "@aws-sdk/client-cloudformation"
import { tagStack } from "./tag"

const description = `
Specifies a list of tags that you want to add to the specified resources. A tag consists of a key and a value that you define.

Shorthand Syntax:
KeyName1=string,KeyName2=string, ...

JSON Syntax:
{ "string": "string", ... }
`.trim()

const program = new Command()
program
    .name("cfntag")
    .requiredOption("--stack-name <stackName>", "The name or unique stack ID of the stack to update.")
    .requiredOption("--tags <tags>", description)
    .version(fs.readFileSync(path.join(__dirname, "../VERSION"), "utf-8").trim())
program.showHelpAfterError()
program.parse()

;(async () => {
    const options = program.opts()
    const stackName = options.stackName as string
    const tags = parseTags(options.tags as string)
    await tagStack(stackName, tags)
})()

export function parseTags(tags: string): Record<string, string> {
    // if tags is json, parse using JSON
    if (tags.startsWith("{")) return JSON.parse(tags)

    // otherwise, treat it as key1=value1,key2=value2,...
    const result: Record<string, string> = {}
    for (const tag of tags.split(",")) {
        const [key, value] = tag.split("=")
        result[key] = value
    }
    return result
}

async function _() {
    try {
        await welcome()
        await printCloudFormationStacks()
    } catch (error) {
        console.log(`😢 Failed to retrieve AWS credentials. Please follow the guide to set up AWS credentials:`)
        console.log('  🔗 https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-your-credentials.html')
        if (error instanceof Error) {
            console.error(`  💥 ${error.name}: ${error.message}`)
        }
    }
}

async function welcome() {
    const sts = new STS({ region: "us-west-2" })
    const response = await sts.getCallerIdentity({})
    console.log('🎉 AWS credentials are set up correctly 🎉')
    console.log(`🔑 AWS Account ID: ${response.Account}`)
}

async function printCloudFormationStacks() {
    const cfn = new CloudFormation()
    let nextToken
    const stacks: StackSummary[] = []

    const StackStatusFilter = Object.values(StackStatus).filter((status) => status !== "DELETE_COMPLETE")
    do {
        const response: ListStacksOutput = await cfn.listStacks({
            StackStatusFilter,
            NextToken: nextToken,
        })
        stacks.push(...(response.StackSummaries ?? []))
        nextToken = response.NextToken
    } while (nextToken)

    console.log(`📋 Found ${stacks.length} CloudFormation stacks:`)
    for (const stack of stacks) {
        console.log(`  📄 [${stack.StackStatus}}] ${stack.StackName}`)
    }
}
