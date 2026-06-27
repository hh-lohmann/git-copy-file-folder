/** Check given arguments for gitCopyFileFolder
 *  - Signature of gitCopyFileFolder is addressed internally
 */
export type _CheckArgsGitCopyFileFolder=(passedArgs:IArguments,errPrefix:string)=>boolean;


/** Method object: Clean up runtime artifacts before exiting
 *  - "context" to distnguish possible multiple calls of a 'git-copy-file-folder' import in the same parent file
 * @method addDeleteFile(namePath,context) - Add "namePath" to list of files to be deleted in "context"
 * @method addDeleteFolder(namePath,context) - Add "namePath" to list of folders to be deleted in "context"
 * @method clean(context) - Run clean up for "context"
 * @type {object}
 */
export type  _CleanUpBeforeExit={
  _errPrefix:string,
  _toDelete:{[key:string]:{[key:string]:string[]}},
  _pushToDeleteList:(list:string,entry:string,context:string)=>void,
  addDeleteFile:(namePath:string,context:string)=>void,
  addDeleteFolder:(namePath:string,context:string)=>void,
  clean:(context:string)=>void
}

/** Copy file / folder from temporary sparse repo to target
 * @example _copyFileFolder=function( 'src/', '../todo', '/tmp/sparse-source' )
 * @param fileOrFolder - Name / path for file / folder to copy
 * @param targetPath - Path to copy to, default: current dir
 * @param sourceRepoName - Name of source repo to copy from
 * @param tempSparseRepo - Temporary sparse repo to copy from
 * @param errPrefix - Prefix for error messages
 * @param cleanUpContext - context for _cleanUpBeforeExit()
 * @returns true on success
 */
export type _CopyFileFolder=(fileOrFolder:string,targetPath:string,sourceRepoName:string,tempSparseRepo:string,errPrefix:string,cleanUpContext:string)=>boolean;


/** Clone repo to new one with no connections to the original
 *  - New repo will have an empty history and no remotes, everything
 *    else will be as in the original
 * @example gitCopyFileFolder('https://github.com/x-y/z','myRepo')
 * @param sourceRepo - URL of the repo to copy from
 * @param fileOrFolder - Name / path for repo to create
 * @param [targetPath] - Optional: Branch name for new repo, default: 'main'
 * @returns `true` on success, `false` else
 */
export const gitCopyFileFolder:GitCopyFileFolder;
export type GitCopyFileFolder=(sourceRepo:string,fileOrFolder:string,targetPath?:string)=>boolean;
