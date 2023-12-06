import fs from "fs"
import { StackResource } from "@aws-sdk/client-cloudformation"

export function parseTags(tags: string): Record<string, string> {
    if (fs.existsSync(tags)) tags = fs.readFileSync(tags, "utf-8")
    // if tags is json, parse using JSON
    if (tags.startsWith("{")) return JSON.parse(tags)

    // otherwise, treat it as key1=value1,key2=value2,...
    const result: Record<string, string> = {}
    for (const tag of tags.split(",")) {
        const [key, value] = tag.split("=")
        result[key] = value
    }
    return result
}

export enum TagResourceResult {
    Success = "✅",
    Error = "❌",
    Skip = "⏭️",
    Unknown = "❓",
}

export interface ResourceTagger {
    tagResource(resource: StackResource, tags: Record<string, string>): Promise<TagResourceResult>
}

export function region(resource: StackResource) {
    return resource.StackId!.split(':')[3]
}

export function accountId(resource: StackResource) {
    return resource.StackId!.split(':')[4]
}

export function handleSuccess(resource: StackResource) {
    console.log(`✅ [${resource.ResourceType}] ${resource.PhysicalResourceId!}`)
}

export function handleError(resource: StackResource, error: any) {
    console.log(`❌ [${resource.ResourceType}] ${resource.PhysicalResourceId!}: `)
    console.error(error)
}

export function handleUnknown(resource: StackResource) {
    console.log(`❓ [${resource.ResourceType}]: No tagging logic implemented`)
}

export default {
    handleSuccess,
    handleError,
    handleUnknown,
    region,
    accountId,
    parseTags,
}
