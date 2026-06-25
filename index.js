// @ts-check

import {basename} from 'node:path';
import {cpSync,existsSync,rmSync,statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import pkg from './package.json' with { type: "json" };

/** @import {_CheckArgs,GitCopyFileFolder} from './types.d.ts' */

/** @type {_CheckArgs} */
const _checkArgs=function(urlOfRepoToCopyFrom,fileFolderNamePath,pathToCopyTo){
  const myPrefix=pkg.name+': ';
  if(arguments.length<2) throw TypeError(`${myPrefix}not enough arguments`);
  if(arguments.length>3) throw TypeError(`${myPrefix}too many arguments`);
  ['urlOfRepoToCopyFrom','fileFolderNamePath','pathToCopyTo'].forEach((value,i)=>{
    if(i===arguments.length) return;
    if(typeof arguments[i]!=='string'||arguments[i]==='') throw TypeError(`${myPrefix}${value} must be a string`);
  })
  return true;
}

/** Check if Git is available
 * @type {()=>boolean}
 */
const _checkGit=function(){
  if(spawnSync('git',['--version']).pid) return true;
  const myPrefix=pkg.name+': ';
  throw ReferenceError(`${myPrefix}Could not call Git - check installation and / or PATH environment variable`);
}

/** Check if target path exists to create already exists
 * @type {(namePath:string)=>boolean}
 */
const _checkTargetExists=function(namePath){
  if(existsSync(namePath)) return true;
  const myPrefix=pkg.name+': ';
  throw ReferenceError(`${myPrefix}Target path "${namePath}" does not exist`);
}

/** Check if repo to copy from is reachable
 *  - NB: not necessarily "does not exist", may be no connection / rights etc.
 * @type {(url:string)=>boolean}
 */
const _checkRemoteRepoExists=function(url){
  if(spawnSync('git',['ls-remote',url]).status===0) return true;
  const myPrefix=pkg.name+': ';
  throw ReferenceError(`${myPrefix}Repo "${url}" not reachable - you may check spelling / access rights / connectivity`);
}

/** Delete file / folder
 * @type {(namePath:string)=>boolean}
 */
const _delFileFolder=function(namePath){
  const myPrefix=pkg.name+': ';
  if(!existsSync(namePath)) throw Error(`${myPrefix}"${namePath}" not found - please check if previous steps were interrupted`);
  try{
    rmSync(namePath,{recursive:true});
  }
  catch(err){
    throw Error(`${myPrefix}Git tracking in new repo "${namePath}" could not be deleted - please check if new repo was corrupted`);
  }
  return true;
}

/** Create temporary sparse clone for repo to copy from
 * @type {(source:string,target:string)=>boolean}
 */
const _cloneRepoTempSparseDepth1NoBlobs=function(source,target){
  if(spawnSync('git',['clone','--sparse','--depth=1','--filter=blob:none',source,target]).status===0) return true;
  const myPrefix=pkg.name+': ';
  throw Error(`${myPrefix}Cloning failed (reason unknown)`);
}

/** Copy file / folder from temporary sparse repo to target
 * @example _copyFileFolder=function( 'src/', '../todo', '/tmp/sparse-source' )
 * @param fileFolderNamePath - Name / path for file / folder
 * @param pathToCopyTo - Path to copy to, default: current dir
 * @param tempSparseRepo - Temporary sparse repo to copy from
 * @returns true on success
 * @type {(fileFolderNamePath:string,pathToCopyTo:string,tempSparseRepo:string)=>boolean}
 */
const _copyFileFolder=function(fileFolderNamePath,pathToCopyTo,tempSparseRepo){
  const normalizeNamePath=function(namePath=''){
    if(namePath.slice(0,1)==='/') return namePath.slice(1);
    if(namePath.slice(0,2)==='./') return namePath.slice(2);
    return namePath;
  }
  const normalizeTarget=function(source=''){
    // console.log('NUGGA',statSync(source).isDirectory());
    if(statSync(source).isDirectory()) return pathToCopyTo+'/'+fileFolderNamePath;
    return pathToCopyTo+'/'+basename(fileFolderNamePath);
  }
  fileFolderNamePath=normalizeNamePath(fileFolderNamePath);
  spawnSync('git',['sparse-checkout','add','./'+fileFolderNamePath],{cwd:tempSparseRepo});
  const source=tempSparseRepo+'/'+fileFolderNamePath;
  const target=normalizeTarget(source);
  cpSync(source,target,{recursive:true});
  return true;
}

/** @type {GitCopyFileFolder} */
export const gitCopyFileFolder=function(urlOfRepoToCopyFrom,fileFolderNamePath,pathToCopyTo='.'){
  _checkGit();
  _checkArgs(...arguments);
  _checkRemoteRepoExists(urlOfRepoToCopyFrom);
  _checkTargetExists(pathToCopyTo);
  const tempCloneRemotePath=`${tmpdir()}/random_${crypto.randomUUID().split('-')[0]}`;
  _cloneRepoTempSparseDepth1NoBlobs(urlOfRepoToCopyFrom,tempCloneRemotePath);
  _copyFileFolder(fileFolderNamePath,pathToCopyTo,tempCloneRemotePath)
  // _delFileFolder(tempCloneRemotePath);
  return true;
}
