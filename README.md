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


## Synopsis

```js
  import { gitCopyFileFolder } from 'git-copy-file-folder'

  gitCopyFileFolder( urlOfRepoToCopyFrom, fileFolderNamePath)

  gitCopyFileFolder( urlOfRepoToCopyFrom, fileFolderNamePath, pathToCopyTo )
```


## Parameters

### urlOfRepoToCopyFrom
URL of the repo from which **[fileFolderNamePath](#filefoldernamepath)** should be copied

### fileFolderNamePath
Name / path for the file / folder to be copied from the **[urlOfRepoToCopyFrom](#urlofrepotocopyfrom)**
  * Interpreted relative to the source repo's root, i.e. `src/index.js` of repo `x` would be `x/src/index.js`

### pathToCopyTo
Optional: Existing path to which **[fileFolderNamePath](#filefoldernamepath)** should be copied to
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
