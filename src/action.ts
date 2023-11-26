import * as core from "@actions/core"
import { tagStack } from "./tag"
import { parseTags } from "./utils"

async function run() {
    const stackName = core.getInput("stack-name")
    const tags = core.getInput("tags")

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
