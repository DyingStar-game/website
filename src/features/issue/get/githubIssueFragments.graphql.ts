export const GITHUB_ISSUE_FRAGMENT = `
  ... on Issue {
    id
    projectItems(first: 1) {
      nodes {
        id
        project {
          title
          number
        }
        content {
            ... on Issue {
              id
              title
              url
              state
              createdAt
              updatedAt
              labels(first: 5) {
                nodes {
                  name
                }
              }
              assignees(first: 10) {
                nodes {
                  login
                  avatarUrl
                }
              }
            }
          }
        fieldValues(first: 10) {
            nodes {
              ... on ProjectV2ItemFieldTextValue {
                text
                field {
                  ... on ProjectV2Field {
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldNumberValue {
                number
                field {
                  ... on ProjectV2Field {
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                color
                field {
                  ... on ProjectV2SingleSelectField {
                    name
                  }
                }
              }
            }
          }
      }
    }
  }
`;
