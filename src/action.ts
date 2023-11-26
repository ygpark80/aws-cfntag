import * as core from "@actions/core"
import { tagStack } from "./tag"
import { parseTags } from "./utils"
import * as aws from "./aws" // DO NOT REMOVE THIS LINE

async function run() {
    const stackName = core.getInput("stack-name")
    const profile = core.getInput("profile")
    const tags = core.getInput("tags")

    if (profile) process.env.AWS_PROFILE = profile
    console.log(process.env)

    console.log("🏷️ Tagging CloudFormation stack...")
    console.log(`  📋 Stack name: ${stackName}`)
    console.log(`  🏷️ Tags:`, parseTags(tags))

    await tagStack(stackName, parseTags(tags))
}

if (require.main === module) {
    run().catch((error) => {
        console.error(error)
        core.setFailed(error)
    })
}
