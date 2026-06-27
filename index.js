// @ts-check

import {basename} from 'node:path';
import {cpSync,existsSync,rmSync,statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import pkg from './package.json' with { type: "json" };

/** @import {_CheckArgsGitCopyFileFolder,_CleanUpBeforeExit,_CopyFileFolder,GitCopyFileFolder} from './types.d.ts' */

/** @type {_CheckArgsGitCopyFileFolder} */
const _checkArgsGitCopyFileFolder=function(passedArgs,errPrefix){
  if(passedArgs.length<2) throw TypeError(`${errPrefix}not enough arguments`);
  if(passedArgs.length>3) throw TypeError(`${errPrefix}too many arguments`);
  ['sourceRepo','fileOrFolder','targetPath'].forEach((value,i)=>{
    if(i===passedArgs.length) return;
    if(typeof passedArgs[i]!=='string'||passedArgs[i]==='') throw TypeError(`${errPrefix}${value} must be a non-empty string`);
  })
  return true;
}

/** Check if Git is available
 * @type {(errPrefix:string)=>boolean}
 */
const _checkGit=function(errPrefix){
  if(spawnSync('git',['--version']).pid) return true;
  throw ReferenceError(`${errPrefix}Could not call Git - check installation and / or PATH environment variable`);
}

/** Check if target path exists
 * @type {(namePath:string,errPrefix:string)=>boolean}
 */
const _checkTargetExists=function(namePath,errPrefix){
  if(existsSync(namePath)) return true;
  throw ReferenceError(`${errPrefix}Target path "${namePath}" does not exist`);
}

/** Check if repo to copy from is reachable
 *  - NB: not necessarily "does not exist", may be no connection / rights etc.
 * @type {(url:string,errPrefix:string)=>boolean}
 */
const _checkSourceRepoReachable=function(url,errPrefix){
  if(spawnSync('git',['ls-remote',url]).status===0) return true;
  throw ReferenceError(`${errPrefix}Source repo "${url}" not reachable - you may check spelling / access rights / connectivity`);
}

/** @type {_CleanUpBeforeExit} */
const _cleanUpBeforeExit={
  _errPrefix: '_cleanUpBeforeExit: ',
  _toDelete: {},
  _pushToDeleteList(list='',entry='',context){
    if(!context) throw SyntaxError(`${this._errPrefix}"context" has to be defined`);
    if(!Object.hasOwn(this._toDelete,context)){this._toDelete[context]={files:[],folders:[]}}
    this._toDelete[context][list].push(entry);
  },
  addDeleteFile(namePath='',context){
    if(namePath==='') return;
    this._pushToDeleteList('files',namePath,context);
  },
  addDeleteFolder(namePath='',context){
    if(namePath==='') return;
    this._pushToDeleteList('folders',namePath,context);
  },
  clean(context){
    if(!context) throw SyntaxError(`${this._errPrefix}"context" has to be defined`);
    if(!Object.hasOwn(this._toDelete,context)) return;
    Object.keys(this._toDelete[context]).forEach(value=>{
      while(this._toDelete[context][value].length!==0){
        const myDeleteNext=this._toDelete[context][value].pop();
        if(!myDeleteNext) return;
        if(!existsSync(myDeleteNext)) throw Error(`${this._errPrefix}"${myDeleteNext}" not found - please check if previous steps were interrupted`);
        try{
          rmSync(myDeleteNext,{recursive:true});
        }
        catch(err){
          throw Error(`${this._errPrefix}"${myDeleteNext}" could not be deleted - please check for possible corruption`);
        }
      }
    })
  }
}

/** Create temporary sparse clone for repo to copy from
 * @type {(source:string,target:string,errPrefix:string)=>boolean}
 */
const _cloneRepoTempSparseDepth1NoBlobs=function(source,target,errPrefix){
  if(spawnSync('git',['clone','--sparse','--depth=1','--filter=blob:none',source,target]).status===0) return true;
  throw Error(`${errPrefix}Cloning failed (reason unknown)`);
}

/** @type {_CopyFileFolder} */
const _copyFileFolder=function(fileOrFolder,targetPath,sourceRepoName,tempSparseRepo,errPrefix,cleanUpContext){
  const normalizeNamePath=function(namePath=''){
    if(namePath.slice(0,1)==='/') return namePath.slice(1);
    if(namePath.slice(0,2)==='./') return namePath.slice(2);
    return namePath;
  }
  const normalizeTarget=function(source=''){
    if(statSync(source).isDirectory()) return targetPath+'/'+fileOrFolder;
    return targetPath+'/'+basename(fileOrFolder);
  }
  fileOrFolder=normalizeNamePath(fileOrFolder);
  spawnSync('git',['sparse-checkout','add','./'+fileOrFolder],{cwd:tempSparseRepo});
  const source=tempSparseRepo+'/'+fileOrFolder;
  if(!existsSync(source)){
    _cleanUpBeforeExit.clean(cleanUpContext);
    throw ReferenceError(`${errPrefix}File / folder "${fileOrFolder}" not available in repo "${sourceRepoName}"- you may check spelling / source repo`);
  }
  const target=normalizeTarget(source);
  cpSync(source,target,{recursive:true});
  return true;
}

/** @type {GitCopyFileFolder} */
export const gitCopyFileFolder=function(sourceRepo,fileOrFolder,targetPath='.'){
  const _myCleanUpBeforeExitContext=crypto.randomUUID();
  const _errPrefix=pkg.name+': ';
  _checkGit(_errPrefix);
  _checkArgsGitCopyFileFolder(arguments,_errPrefix);
  _checkSourceRepoReachable(sourceRepo,_errPrefix);
  _checkTargetExists(targetPath,_errPrefix);
  const tempClonePath=`${tmpdir()}/random_${crypto.randomUUID().split('-')[0]}`;
  _cleanUpBeforeExit.addDeleteFolder(tempClonePath,_myCleanUpBeforeExitContext);
  _cloneRepoTempSparseDepth1NoBlobs(sourceRepo,tempClonePath,_errPrefix);
  _copyFileFolder(fileOrFolder,targetPath,sourceRepo,tempClonePath,_errPrefix,_myCleanUpBeforeExitContext)
  _cleanUpBeforeExit.clean(_myCleanUpBeforeExitContext);
  return true;
}
