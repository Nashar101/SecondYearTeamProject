import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Testing e2e test', () => {
  const testingPageUrl = '/testing';
  const testingPageUrlPattern = new RegExp('/testing(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const testingSample = { suwi: 'neural back-end' };

  let testing;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/testings+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/testings').as('postEntityRequest');
    cy.intercept('DELETE', '/api/testings/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (testing) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/testings/${testing.id}`,
      }).then(() => {
        testing = undefined;
      });
    }
  });

  it('Testings menu should load Testings page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('testing');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Testing').should('exist');
    cy.url().should('match', testingPageUrlPattern);
  });

  describe('Testing page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(testingPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Testing page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/testing/new$'));
        cy.getEntityCreateUpdateHeading('Testing');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', testingPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/testings',
          body: testingSample,
        }).then(({ body }) => {
          testing = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/testings+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [testing],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(testingPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Testing page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('testing');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', testingPageUrlPattern);
      });

      it('edit button click should load edit Testing page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Testing');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', testingPageUrlPattern);
      });

      it('edit button click should load edit Testing page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Testing');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', testingPageUrlPattern);
      });

      it('last delete button click should delete instance of Testing', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('testing').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', testingPageUrlPattern);

        testing = undefined;
      });
    });
  });

  describe('new Testing page', () => {
    beforeEach(() => {
      cy.visit(`${testingPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Testing');
    });

    it('should create an instance of Testing', () => {
      cy.get(`[data-cy="suwi"]`).type('system-worthy Small Refined').should('have.value', 'system-worthy Small Refined');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        testing = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', testingPageUrlPattern);
    });
  });
});
