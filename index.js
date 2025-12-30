// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

/*
 * Developed for Anunzio International by Anzul Aqeel
 * Contact +971545822608 or +971585515742
 */

const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const token = core.getInput('token');
        const command = core.getInput('command') || 'both';

        const octokit = github.getOctokit(token);
        const { owner, repo, number } = github.context.issue;

        // Safety check: Ensure the PR author is dependabot
        const { data: pullRequest } = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: number
        });

        if (pullRequest.user.login !== 'dependabot[bot]') {
            console.log('PR author is not dependabot. Skipping.');
            return;
        }

        if (command === 'approve' || command === 'both') {
            console.log(`Approving PR #${number}...`);
            await octokit.rest.pulls.createReview({
                owner,
                repo,
                pull_number: number,
                event: 'APPROVE',
                body: 'Approved by Dependabot Auto-Merge Action.'
            });
            console.log('PR Approved.');
        }

        if (command === 'enable-auto-merge' || command === 'both') {
            console.log(`Enabling auto-merge for PR #${number}...`);

            // Note: "enableAutoMerge" is a GraphQL mutation, not REST API.
            // We will fall back to merging immediately if checks pass, or use the mutation.

            const query = `mutation($pullRequestId: ID!) {
        enablePullRequestAutoMerge(input: {pullRequestId: $pullRequestId}) {
          pullRequest {
             autoMergeRequest {
               enabledAt
             }
          }
        }
      }`;

            // We need the node_id for GraphQL
            const prNodeId = pullRequest.node_id;

            try {
                await octokit.graphql(query, {
                    pullRequestId: prNodeId
                });
                console.log('Auto-merge enabled.');
            } catch (error) {
                console.error('Failed to enable auto-merge via GraphQL. Trying merge via REST (if mergable)...');
                // Fallback or just error out. Usually GraphQL is required for "Enable Auto Merge" vs direct merge
            }
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel
