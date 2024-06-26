// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'You did it!')
  })

  it('should have a button with text "Click Me"', () => {
    cy.visit('/')
    cy.get('button').should('contain', 'Click Me')
  })

  it('should navigate to a new page when button is clicked', () => {
    cy.visit('/')
    cy.get('button').click()
    cy.url().should('include', '/new-page')
  })
})