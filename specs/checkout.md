# Checkout Feature

## Scenario: Successful checkout
Given user is logged in
When user adds an item to cart
And user completes checkout with valid shipping info
Then order confirmation should be displayed