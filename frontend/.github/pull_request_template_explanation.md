# Explanation on the Pull Request Template

The idea of a Pull Request Template is to help us understand better the scope of every set of proposed changes. In this document, we will explain every block of the current pull request template.

## Pull Request Name

Before doing anything else, we have to name the Pull Request. Use the following pattern:

```
[TICKET] Title
```

This is important because we have automation scripts running, which use the previous pattern to take actions.

### TICKET

The `TICKET` makes reference to the proper NOTION-JIRA ticket (e.g. MM-1).
If no ticket is needed, use the prefix `[NOTICKET]` instead. If not ticket was assigned yet, add the label `needs-ticket`. There are cases in which no ticket needs to be assigned, but those should be few and apart.

### Title

The `Title` should be written by following the next pattern: _If applied, this set of proposed changes will ${title}_. Example of good cases:

- _If applied, this set of proposed changes will_ refactor subsystem X for readability
- _If applied, this set of proposed changes will_ update getting started documentation
- _If applied, this set of proposed changes will_ remove deprecated methods
- _If applied, this set of proposed changes will_ release version 1.0.0
- _If applied, this set of proposed changes will_ merge pull request #123 from user/branch

Notice how this doesn’t work for the other non-imperative forms:

- _If applied, this set of proposed changes will_ ~~fixed bug with Y~~
- _If applied, this set of proposed changes will_ ~~changing behavior of X~~
- _If applied, this set of proposed changes will_ ~~more fixes for broken stuff~~
- _If applied, this set of proposed changes will_ ~~sweet new API methods~~

## Motivation / Context / Description

Here you should include a link to the NOTION JIRA ticket that holds all the information needed to understand the changes of this PR and how test them.

**Ticket:** Replace `<Ticket-ID>` with the proper NOTION JIRA ticket. In case there are no related tickets, replace this field with all the information that would be needed to understand and test this change.

**Feature link:** Replace the link with a URL to test your changes. If none exist, remove the field.

## Type of Change

To judge in a glance the priority of the Pull Request, we have set here three categories:

- **Bug fix**. Higher priority, this set of proposed changes, will fix a current bug.
- **New feature**. Lower priority, introducing a new feature into our source code.
- **Other**. Variable priority, when our set of proposed changes doesn't really fall in the two previous categories.

## Checklist

> 1. Follow coding guidelines

Soon to be announced.

> 2. Avoid code duplication; use libraries.

We put a strong emphasis in no copying/pasting code. If the code has a strong logic on it, which can be tested in isolation, it is probably because it should be part of a library. Also, if the code is being used in multiple places, probably belongs to a library.

> 3. Test library changes (include unit tests).

Our libraries should have the most logic on them, and as so, we need to properly test them. By testing them, we can ensure that other changes will not break our core logic, and be at ease that what we did works. Remember to test [happy and unhappy flows](https://en.wikipedia.org/wiki/Happy_path). Testing that our multiplier function works when passing a number is all great, but testing that it does what it should do when passing a string is also the better.

> 4. Update documentation to match changes.

Sometimes, our new set of changes do not correspond anymore with the READMEs. Modify them accordingly in the same Pull Request (so they can be reverted together with your proposed changes if needed).

Also, ensure that you have added in the `Motivation / Context / Description` section the proper **feature** and NOTION JIRA **ticket**. Read that section for more information about them.

In order to help developers better test your code, include any instructions for how to reach and/or reproduce the PR's changes in the browser, when appropriate. Better yet, use one of our tools to display your code in isolation (e.g. storybooks).

> 5. Self-review changes before reviewer assignment.

The first step, while creating a Pull Request, is to do yourself the first review of the code. How can you ask others to review your work, if you don't care about it? Our advice is to first create a [_Draft_](https://github.blog/2019-02-14-introducing-draft-pull-requests/), and then, after you have ensured everything is alright, transform it into a _Pull Request_.

> 6. Request review post all checks.

This is our "_I have read all the terms & conditions_" box. When doing a postmortem, we would look at what things went wrong, and this unmarked checkbox might be one of them.
