import { StackResource } from "@aws-sdk/client-cloudformation"
import { S3Client, GetBucketTaggingCommand, PutBucketTaggingCommand } from "@aws-sdk/client-s3"
import { ResourceTagger, TagResourceResult } from "../utils"

export default class S3 implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>) {

        const s3 = new S3Client()
        switch (resource.ResourceType) {
            case "AWS::S3::Bucket":
                try {
                    const Bucket = resource.PhysicalResourceId!
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    const { TagSet: existingTags } = await s3.send(new GetBucketTaggingCommand({ Bucket }))
                    const TagSet = Array.from([...existingTags!, ...Tags].reduce((map, tag) => map.set(tag.Key, tag), new Map()).values())
                    await s3.send(new PutBucketTaggingCommand({ Bucket, Tagging: { TagSet } }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}