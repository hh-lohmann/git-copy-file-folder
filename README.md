###### npm-package

# Copy file / folder from Git repo without cloning

Copy a file or folder from a Git repo instead of cloning, i.e. without a connection to the source

Changes in the original repo will not affect the copy of the file / folder and vice versa.

Helpful to reuse specific contents of another repo in a current one without mixing both repos.

*[hh lohmann &lt;hh.lohmann@gmail.com&gt;](mailto:hh.lohmann@gmail.com?subject=git-copy-file-folder)*

<!-- see https://hh-lohmann.github.io/github-readme-pages-switch -->
<p align="center" id="github_readme_pages_switch" style="display:none;">
  <b><i>This page may be displayed more optimal in its
  <a href="https://hh-lohmann.github.io/git-copy-file-folder">GitHub Pages view</a>
  </i></b>
</p>


## Caution

  * Does not check if a file / folder with the same name already exists in your target - this is up to you, especially in case you explicitly want to overwrite / reset existing files (cf. [Details](#details))


## Synopsis

```js
  import { gitCopyFileFolder } from 'git-copy-file-folder'

  gitCopyFileFolder( sourceRepo, fileOrFolder)

  gitCopyFileFolder( sourceRepo, fileOrFolder, targetPath )
```


## Parameters

### sourceRepo
URL of the repo from which **[fileOrFolder](#fileorfolder)** should be copied

### fileOrFolder
Name / path for the file / folder to be copied from the **[sourceRepo](#sourcerepo)**
  * Interpreted relative to the source repo's root, i.e. `src/index.js` of repo `x` would be `x/src/index.js`

### targetPath
Optional: Existing path to which **[fileOrFolder](#fileorfolder)** should be copied to
  * Default: current folder


## Returns

  * `true` on success, `false` else


## Examples

```js
  gitCopyFileFolder(
    'https://github.com/acmecorp/solve-all-problems',
    'secretsolutions'
  )

  gitCopyFileFolder(
    'https://github.com/acmecorp/solve-all-problems',
    'secretsolutions/solution-42.js',
    'ripped-stuff/acme/'
  )
```


## Installation

Pick for your preferred package manager:

```shell
  npm i git-copy-file-folder
```

```shell
  pnpm i git-copy-file-folder
```

```shell
  bun i git-copy-file-folder
```

```shell
  # For Yarn you should double check docs for your and / or
  # current Yarn version, newer versions do not treat `i package_name`
  # as an alias for `add ...` and exclude global installations
  yarn add git-copy-file-folder
```


## Details

  * Only one file / folder per call (multiple files / folders or globbing goes beyond the current time budget for this project)

  * Does not check if a file / folder with the same name already exists in your target before probably overwriting it, partly for simplicity, partly to give surrounding code full control about e.g. deciding if overwriting an old version with a newer one or a diverged / corrupted version with the original one may be explicitly intended. 

  * Copying takes place via a temporary [sparse clone](#git-clone-sparse) and a [sparse-checkout](#git-sparse-checkout) there (deleted after copying the file / folder requested)


## Tests

  * Code tests to be run with Node.js / Bun available in [Source Code](#source-code)


## Source Code

  * GitHub: <https://github.com/hh-lohmann/git-copy-file-folder>


## License

  * See LICENSE file included here and in [Source Code](#source-code)


## References

### Git: clone sparse
  * <https://git-scm.com/docs/git-clone#Documentation/git-clone.txt---sparse>

### Git: sparse-checkout
  * <https://git-scm.com/docs/git-sparse-checkout>


<!-- see https://hh-lohmann.github.io/html-endspacer -->
<p id="endspacer" data-version="0.2.0" title="Endspacer - helps to align scrolling and positioning link targets | Scroll up to content or click / touch to jump to page top" align="center"><a href="#top"><img alt="Endspacer: './markdown-assets/endspacer.png' missing - see https://hh-lohmann.github.io/html-endspacer" src="./markdown-assets/endspacer.png" height="1000" width="100%"><br>[top]</a></p>
