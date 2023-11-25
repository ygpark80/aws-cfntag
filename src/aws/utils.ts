import { StackResource } from "@aws-sdk/client-cloudformation"

export enum TagResourceResult {
    Success = "✅",
    Error = "❌",
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
}
