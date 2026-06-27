// @ts-check

import { assert, suite, test } from 'node-test-bootstrap';
import { mkdirSync } from 'node:fs';
import {tmpdir} from 'node:os';

import { gitCopyFileFolder } from 'git-copy-file-folder';
import { existsSync } from 'node:fs';

console.log('Starting tests ...');
console.log('(Tests involve test downloads that may take some seconds)');

suite('Fails on invalid arguments',()=>{
  test('Not enough arguments',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>gitCopyFileFolder(''),
      /not enough arguments/
    )
  });
  test('Too many arguments',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>gitCopyFileFolder('','','',''),
      /too many arguments/
    )
  });
  test('sourceRepo must be a non-empty string',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>gitCopyFileFolder([],'',''),
      /sourceRepo must be a non-empty string/
    )
  })
  test('fileOrFolder must be a non-empty string',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>gitCopyFileFolder('',[],''),
      /sourceRepo must be a non-empty string/
    )
  })
  test('targetPath must be a non-empty string',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>gitCopyFileFolder('','',[]),
      /sourceRepo must be a non-empty string/
    )
  })
});

suite('Fail on missing prerequisites',()=>{
  test('Git not available',{skip:false},()=>{
    const orgPath=process.env.PATH;
    process.env.PATH='';
    assert.throws(
      ()=>gitCopyFileFolder('','',''),
      /Could not call Git/
    )
    process.env.PATH=orgPath;
  })
  test('sourceRepo not reachable',{skip:false},()=>{
    assert.throws(
      ()=>gitCopyFileFolder(crypto.randomUUID(),'x','y'),
      /not reachable/
    )
  })
  test('targetPath does not exist',{skip:false},()=>{
    assert.throws(
      ()=>gitCopyFileFolder('https://github.com/hh-lohmann/git-copy-file-folder','x',crypto.randomUUID()),
      /does not exist/
    )
  })
});

suite('Fail while processing',()=>{
  test('Cloning sparse repo fails',{skip:false},()=>{
    const orgTEMP=tmpdir();
    process.env['TEMP']='/dev/null';
    assert.throws(
      ()=>gitCopyFileFolder('https://github.com/hh-lohmann/git-copy-file-folder','x',tmpdir()),
      /Cloning failed/
    )
    process.env['TEMP']=orgTEMP;
  })
  test('fileOrFolder does not exist',{skip:false},()=>{
    assert.throws(
      ()=>gitCopyFileFolder('https://github.com/hh-lohmann/git-copy-file-folder','x'),
      /not available in repo/
    )
  })
});

suite('Result',()=>{
  test('fileOrFolder successfully copied',{skip:false},()=>{
    const myTempPath=tmpdir()+'/'+crypto.randomUUID();
    mkdirSync(myTempPath);
    gitCopyFileFolder('https://github.com/hh-lohmann/git-copy-file-folder','README.md',myTempPath);
    assert.ok(existsSync(myTempPath+'/README.md'));
  })
});
