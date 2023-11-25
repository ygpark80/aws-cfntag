import { ResourceTagger, TagResourceResult } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { EC2Client, CreateTagsCommand } from "@aws-sdk/client-ec2"

export default class EC2 implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>) {
        const ec2 = new EC2Client()

        switch (resource.ResourceType) {
            case "AWS::EC2::Instance":
                try {
                    const Resources = [resource.PhysicalResourceId!]
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    await ec2.send(new CreateTagsCommand({ Resources, Tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}
