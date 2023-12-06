import { StackResource } from "@aws-sdk/client-cloudformation"
import { IAMClient, TagRoleCommand, TagUserCommand } from "@aws-sdk/client-iam"
import { ResourceTagger, TagResourceResult } from "../utils"
import utils from "../utils"

export default class IAM implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>) {
        const iam = new IAMClient()

        switch (resource.ResourceType) {
            case "AWS::IAM::Role":
                try {
                    const RoleName = resource.PhysicalResourceId!
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    await iam.send(new TagRoleCommand({ RoleName, Tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            case "AWS::IAM::User":
                try {
                    const UserName = resource.PhysicalResourceId!
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    await iam.send(new TagUserCommand({ UserName, Tags }))
                    utils.handleSuccess(resource)
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}
