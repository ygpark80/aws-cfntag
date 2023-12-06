import { CloudFormationClient, DescribeStackResourcesCommand } from "@aws-sdk/client-cloudformation"
import { ResourceTagger, TagResourceResult } from "./utils"
import Table from "cli-table3"

// ncc does not like dynamic imports
const services: Record<string, Promise<{ default: new () => ResourceTagger } | undefined>> = {
    apigateway: import("./aws/apigateway"),
    apigatewayv2: import("./aws/apigatewayv2"),
    ec2: import("./aws/ec2"),
    ecs: import("./aws/ecs"),
    elasticloadbalancingv2: import("./aws/elasticloadbalancingv2"),
    iam: import("./aws/iam"),
    lambda: import("./aws/lambda"),
    logs: import("./aws/logs"),
    s3: import("./aws/s3"),
}

export async function tagStack(StackName: string, Tags: Record<string, string>) {
    console.log("🏷️ Tagging CloudFormation stack...")
    console.log(`📋 Stack name: ${StackName}`)
    console.log(`🏷️ Tags:`, Tags)
    
    const StackResources = await getStackResources(StackName)
    if (!StackResources) {
        console.log(`🚫 Stack not found: ${StackName}`)
        return
    }

    const rows = await Promise.all(StackResources.map(async (resource) => {
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html
        const serviceName = resource.ResourceType!.split('::')[1]

        const row = {
            Result: TagResourceResult.Unknown,
            Type: resource.ResourceType,
            // LogicalResourceId: resource.LogicalResourceId,
            PhysicalResourceId: resource.PhysicalResourceId,
        }

        const module = await services[serviceName.toLocaleLowerCase()]
        if (module) {
            const instance = new module.default()
            try {
                row.Result = await instance!.tagResource(resource, Tags)
            } catch (e) {
                row.Result = TagResourceResult.Error
            }
        }
        return row
    }))

    if (rows.length > 0) {
        const table = new Table({
            head: Object.keys(rows[0]),
        })
        rows.forEach(row => {
            table.push(Object.values(row))
        })
        console.log(table.toString())
    }
}

async function getStackResources(StackName: string) {
    const cfn = new CloudFormationClient()

    try {
        const { StackResources } = await cfn.send(new DescribeStackResourcesCommand({ StackName }))
        return StackResources
    } catch (e) {
        return undefined
    }
}