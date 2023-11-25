import { STS } from "@aws-sdk/client-sts"
import { CloudFormation, ListStacksOutput, StackSummary } from "@aws-sdk/client-cloudformation"

(async () => {
    try {
        const sts = new STS({ region: "us-west-2" })
        const response = await sts.getCallerIdentity({})
        console.log('🎉 AWS credentials are set up correctly 🎉')
        console.log(`🔑 AWS Account ID: ${response.Account}`)

        await printCloudFormationStacks()
    } catch (error) {
        console.log(`😢 Failed to retrieve AWS credentials. Please follow the guide to set up AWS credentials:`)
        console.log('  🔗 https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-your-credentials.html')
        if (error instanceof Error) {
            console.error(`  💥 ${error.name}: ${error.message}`)
        }
    }
})()

async function printCloudFormationStacks() {
    const cfn = new CloudFormation()
    let nextToken
    const stacks: StackSummary[] = []

    do {
        const response: ListStacksOutput = await cfn.listStacks({ NextToken: nextToken })
        stacks.push(...(response.StackSummaries ?? []))
        nextToken = response.NextToken
    } while (nextToken)

    console.log(`📋 Found ${stacks.length} CloudFormation stacks:`)
    for (const stack of stacks) {
        console.log(`  📄 ${stack.StackName}`)
    }
}
