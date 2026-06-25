/** Check given arguments for gitCopyFileFolder
 *  - Signature = gitCopyFileFolder except arg types and optionality (for testing)
 */
export type _CheckArgs=(urlOfRepoToCopyFrom?:any,fileFolderNamePath?:any,pathToCopyTo?:any)=>boolean;

/** Clone repo to new one with no connections to the original
 *  - New repo will have an empty history and no remotes, everything
 *    else will be as in the original
 * @example gitCopyFileFolder('https://github.com/x-y/z','myRepo')
 * @param urlOfRepoToCopyFrom - URL of the repo to copy from
 * @param fileFolderNamePath - Name / path for repo to create
 * @param [pathToCopyTo] - Optional: Branch name for new repo, default: 'main'
 * @returns `true` on success, `false` else
 */
export const gitCopyFileFolder:GitCopyFileFolder;
export type GitCopyFileFolder=(urlOfRepoToCopyFrom:string,fileFolderNamePath:string,pathToCopyTo?:string)=>boolean;
