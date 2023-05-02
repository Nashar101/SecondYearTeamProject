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

describe('HistoryTwo e2e test', () => {
  const historyTwoPageUrl = '/history-two';
  const historyTwoPageUrlPattern = new RegExp('/history-two(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const historyTwoSample = {};

  let historyTwo;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/history-twos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/history-twos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/history-twos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (historyTwo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/history-twos/${historyTwo.id}`,
      }).then(() => {
        historyTwo = undefined;
      });
    }
  });

  it('HistoryTwos menu should load HistoryTwos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('history-two');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('HistoryTwo').should('exist');
    cy.url().should('match', historyTwoPageUrlPattern);
  });

  describe('HistoryTwo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(historyTwoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create HistoryTwo page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/history-two/new$'));
        cy.getEntityCreateUpdateHeading('HistoryTwo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyTwoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/history-twos',
          body: historyTwoSample,
        }).then(({ body }) => {
          historyTwo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/history-twos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [historyTwo],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(historyTwoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details HistoryTwo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('historyTwo');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyTwoPageUrlPattern);
      });

      it('edit button click should load edit HistoryTwo page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HistoryTwo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyTwoPageUrlPattern);
      });

      it('edit button click should load edit HistoryTwo page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HistoryTwo');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyTwoPageUrlPattern);
      });

      it('last delete button click should delete instance of HistoryTwo', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('historyTwo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', historyTwoPageUrlPattern);

        historyTwo = undefined;
      });
    });
  });

  describe('new HistoryTwo page', () => {
    beforeEach(() => {
      cy.visit(`${historyTwoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('HistoryTwo');
    });

    it('should create an instance of HistoryTwo', () => {
      cy.get(`[data-cy="subject"]`).type('New').should('have.value', 'New');

      cy.get(`[data-cy="subjectScore"]`).type('86249').should('have.value', '86249');

      cy.get(`[data-cy="subjectTarget"]`).type('35013').should('have.value', '35013');

      cy.get(`[data-cy="upcomingTest"]`).type('redundant Director').should('have.value', 'redundant Director');

      cy.get(`[data-cy="upcomingTestTarget"]`).type('70350').should('have.value', '70350');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        historyTwo = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', historyTwoPageUrlPattern);
    });
  });
});
