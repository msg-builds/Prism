# Prism

A fork of Twenty. Please read the [open-source license](LICENSE) and [trademark notice](.github/TRADEMARK.md).

Prism is the CRM engine of Nebula: a modified [Twenty](https://github.com/twentyhq/twenty) `v2.51.0`, offered here under the AGPL-3.0 (see [LICENSE](LICENSE)).

## Twenty Enterprise files are not in this repository

Twenty marks some files with an `@license Enterprise` header comment. They are under Twenty's commercial licence, not the AGPL, so this repository never contains them. Prism uses none of their features. The 569 files are listed with their upstream blob hashes in [`self-host/enterprise-files.txt`](self-host/enterprise-files.txt).

The code still needs them to build. Restore them, unchanged, from Twenty's public `twenty/v2.51.0` before installing or building:

```bash
self-host/restore-enterprise-files.sh   # fetches from github.com/twentyhq/twenty and checks every hash
```

`self-host/build-image.sh` and CI do this automatically. Restored files stay untracked, and CI fails if one is ever committed.
