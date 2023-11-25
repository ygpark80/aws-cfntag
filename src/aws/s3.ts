import { ResourceTagger } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { S3Client, GetBucketTaggingCommand, PutBucketTaggingCommand } from "@aws-sdk/client-s3"

export default class S3 implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>): Promise<void> {
        const region = utils.region(resource)
        const accountId = utils.accountId(resource)
        const s3 = new S3Client()

        switch (resource.ResourceType) {
            case "AWS::S3::Bucket":
                try {
                    const Bucket = resource.PhysicalResourceId!
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    const { TagSet: existingTags } = await s3.send(new GetBucketTaggingCommand({ Bucket }))
                    const TagSet = Array.from([...existingTags!, ...Tags].reduce((map, tag) => map.set(tag.Key, tag), new Map()).values())
                    await s3.send(new PutBucketTaggingCommand({ Bucket, Tagging: { TagSet } }))
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