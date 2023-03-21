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

describe('History e2e test', () => {
  const historyPageUrl = '/history';
  const historyPageUrlPattern = new RegExp('/history(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const historySample = {};

  let history;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/histories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/histories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/histories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (history) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/histories/${history.id}`,
      }).then(() => {
        history = undefined;
      });
    }
  });

  it('Histories menu should load Histories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('history');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('History').should('exist');
    cy.url().should('match', historyPageUrlPattern);
  });

  describe('History page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(historyPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create History page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/history/new$'));
        cy.getEntityCreateUpdateHeading('History');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/histories',
          body: historySample,
        }).then(({ body }) => {
          history = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/histories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [history],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(historyPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details History page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('history');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyPageUrlPattern);
      });

      it('edit button click should load edit History page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('History');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyPageUrlPattern);
      });

      it('edit button click should load edit History page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('History');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyPageUrlPattern);
      });

      it('last delete button click should delete instance of History', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('history').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyPageUrlPattern);

        history = undefined;
      });
    });
  });

  describe('new History page', () => {
    beforeEach(() => {
      cy.visit(`${historyPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('History');
    });

    it('should create an instance of History', () => {
      cy.get(`[data-cy="subject"]`).type('XML Planner').should('have.value', 'XML Planner');

      cy.get(`[data-cy="subjectScore"]`).type('15143').should('have.value', '15143');

      cy.get(`[data-cy="subjectTarget"]`).type('10947').should('have.value', '10947');

      cy.get(`[data-cy="upcomingTest"]`).type('Program Associate reboot').should('have.value', 'Program Associate reboot');

      cy.get(`[data-cy="upcomingTestTarget"]`).type('95127').should('have.value', '95127');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        history = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', historyPageUrlPattern);
    });
  });
});
