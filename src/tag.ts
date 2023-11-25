import { CloudFormationClient, DescribeStackResourcesCommand } from "@aws-sdk/client-cloudformation"
import { ResourceTagger, TagResourceResult } from "./aws"
import Table from "cli-table3"

export async function tagStack(StackName: string, Tags: Record<string, string>) {
    const cfn = new CloudFormationClient()
    const { StackResources } = await cfn.send(new DescribeStackResourcesCommand({ StackName }))

    const rows = await Promise.all(StackResources!.map(async (resource) => {
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html
        const serviceName = resource.ResourceType!.split('::')[1]

        const module = await import(`./aws/${serviceName.toLocaleLowerCase()}`)
        const instance: ResourceTagger = new module.default()

        const row = {
            Result: TagResourceResult.Unknown,
            Type: resource.ResourceType,
            // LogicalResourceId: resource.LogicalResourceId,
            PhysicalResourceId: resource.PhysicalResourceId,
        }
        try {
            row.Result = await instance.tagResource(resource, Tags)
        } catch (e) {
            row.Result = TagResourceResult.Error
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