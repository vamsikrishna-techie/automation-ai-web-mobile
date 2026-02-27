# Login Feature

## Scenario: Successful login
Given user is on login page
When user enters valid credentials
Then user should see products page

## Scenario: Invalid password
Given user is on login page
When user enters wrong password
Then error message should be displayed