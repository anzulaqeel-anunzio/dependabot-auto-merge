# Dependabot Auto-Merge

Simplify your dependency management. This action can be used in your workflows to automatically approve and enable auto-merge for safe Dependabot Pull Requests (like semver-patch updates).

## Features

-   **Auto-Approve**: Automatically approves PRs from Dependabot.
-   **Auto-Merge**: Enables GitHub's auto-merge feature.
-   **Security**: Checks target branch and PR author.

## Usage

Create a workflow file (e.g., `.github/workflows/dependabot-merge.yml`):

```yaml
name: Dependabot Auto-Merge
on: pull_request

permissions:
  contents: write
  pull-requests: write

jobs:
  dependabot:
    runs-on: ubuntu-latest
    if: ${{ github.actor == 'dependabot[bot]' }}
    steps:
      - uses: actions/checkout@v3
      - name: Auto Merge Metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1.1.1
        with:
          github-token: '${{ secrets.GITHUB_TOKEN }}'
      
      - name: Auto Merge Action
        uses: ./
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          target: minor
          # Only merge minor and patch updates
          command: 'enable-auto-merge'
```

## Inputs

| Input | Description | Default |
| :--- | :--- | :--- |
| `token` | GITHUB_TOKEN | `${{ github.token }}` |
| `command` | Action to take: `approve` or `enable-auto-merge` or `both` | `both` |

## Contact

Developed for Anunzio International by Anzul Aqeel.
Contact +971545822608 or +971585515742.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
### 🔗 Part of the "Ultimate Utility Toolkit"
This tool is part of the **[Anunzio International Utility Toolkit](https://github.com/anzulaqeel/ultimate-utility-toolkit)**.
Check out the full collection of **180+ developer tools, scripts, and templates** in the master repository.

Developed for Anunzio International by Anzul Aqeel.
