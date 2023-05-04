describe('testing homepage', () => {
  it('loads and contains HomePage, homepage text, AddTip nav and View All Tips nav', () => {
    cy.visit('http://localhost')
    cy.contains('HomePage')
    cy.contains('Welcome to TOTD (Tip Of The Day) Application')
    cy.contains('Add Tip')
    cy.contains('View All Tips')
  })
})
describe('testing add tip', () => {
  it('check to see if add tip page works', () => {
    cy.visit('http://localhost')
    cy.get('[href="/addtip"]').click()
    cy.url().should('include', 'addtip')
    cy.get('#description').type('this is a test')
    cy.get('.css-8t1ae8 > .MuiButtonBase-root').click()
  })
})

describe('testing view all tips', () => {
  it('check to see if view all tips page works', () => {
    cy.visit('http://localhost')
    cy.get('[href="/viewtips"]').click()
    cy.url().should('include', 'viewtips')
  })
  it('check to see if view all tips delete works', () => {
    cy.visit('http://localhost')
    cy.get('[href="/viewtips"]').click()
    cy.url().should('include', 'viewtips')
    cy.get(':nth-child(13) > :nth-child(4) > .MuiButtonBase-root').click()
  })
})