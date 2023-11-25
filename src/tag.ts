import { CloudFormationClient, DescribeStackResourcesCommand } from "@aws-sdk/client-cloudformation"
import { ResourceTagger } from "./aws"

export async function tagStack(StackName: string, Tags: Record<string, string>) {
    const cfn = new CloudFormationClient()
    const { StackResources } = await cfn.send(new DescribeStackResourcesCommand({ StackName }))

    for (const resource of StackResources!) {
        try {
            const resourceTypePrefix = resource.ResourceType!.split('::')[1]

            const module = await import(`./aws/${resourceTypePrefix.toLocaleLowerCase()}`)
            const instance = new module.default() as ResourceTagger
            instance.tagResource(resource, Tags)
        } catch (e) {
            console.error(e)
        }
    }
}