import { ResourceTagger } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { IAMClient, TagRoleCommand, TagUserCommand } from "@aws-sdk/client-iam"

export default class IAM implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>): Promise<void> {
        const region = utils.region(resource)
        const accountId = utils.accountId(resource)
        const iam = new IAMClient()

        switch (resource.ResourceType) {
            case "AWS::IAM::Role":
                try {
                    const RoleName = resource.PhysicalResourceId!
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    await iam.send(new TagRoleCommand({ RoleName, Tags }))
                    utils.handleSuccess(resource)
                } catch (error) {
                    utils.handleError(resource, error)
                }
                break
            case "AWS::IAM::User":
                try {
                    const UserName = resource.PhysicalResourceId!
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    await iam.send(new TagUserCommand({ UserName, Tags }))
                    utils.handleSuccess(resource)
                } catch (error) {
                    utils.handleError(resource, error)
                }
                break
            default:
                utils.handleUnknown(resource)
                break
        }
    }

}
