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

describe('AntiprocrastinationListTwo e2e test', () => {
  const antiprocrastinationListTwoPageUrl = '/antiprocrastination-list-two';
  const antiprocrastinationListTwoPageUrlPattern = new RegExp('/antiprocrastination-list-two(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const antiprocrastinationListTwoSample = {};

  let antiprocrastinationListTwo;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/antiprocrastination-list-twos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/antiprocrastination-list-twos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/antiprocrastination-list-twos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (antiprocrastinationListTwo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/antiprocrastination-list-twos/${antiprocrastinationListTwo.id}`,
      }).then(() => {
        antiprocrastinationListTwo = undefined;
      });
    }
  });

  it('AntiprocrastinationListTwos menu should load AntiprocrastinationListTwos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('antiprocrastination-list-two');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AntiprocrastinationListTwo').should('exist');
    cy.url().should('match', antiprocrastinationListTwoPageUrlPattern);
  });

  describe('AntiprocrastinationListTwo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(antiprocrastinationListTwoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AntiprocrastinationListTwo page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/antiprocrastination-list-two/new$'));
        cy.getEntityCreateUpdateHeading('AntiprocrastinationListTwo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiprocrastinationListTwoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/antiprocrastination-list-twos',
          body: antiprocrastinationListTwoSample,
        }).then(({ body }) => {
          antiprocrastinationListTwo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/antiprocrastination-list-twos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [antiprocrastinationListTwo],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(antiprocrastinationListTwoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AntiprocrastinationListTwo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('antiprocrastinationListTwo');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiprocrastinationListTwoPageUrlPattern);
      });

      it('edit button click should load edit AntiprocrastinationListTwo page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AntiprocrastinationListTwo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiprocrastinationListTwoPageUrlPattern);
      });

      it('edit button click should load edit AntiprocrastinationListTwo page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AntiprocrastinationListTwo');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiprocrastinationListTwoPageUrlPattern);
      });

      it('last delete button click should delete instance of AntiprocrastinationListTwo', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('antiprocrastinationListTwo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiprocrastinationListTwoPageUrlPattern);

        antiprocrastinationListTwo = undefined;
      });
    });
  });

  describe('new AntiprocrastinationListTwo page', () => {
    beforeEach(() => {
      cy.visit(`${antiprocrastinationListTwoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AntiprocrastinationListTwo');
    });

    it('should create an instance of AntiprocrastinationListTwo', () => {
      cy.get(`[data-cy="link"]`).type('withdrawal system New').should('have.value', 'withdrawal system New');

      cy.get(`[data-cy="type"]`).type('Awesome Quality Avon').should('have.value', 'Awesome Quality Avon');

      cy.get(`[data-cy="days"]`).type('65862').should('have.value', '65862');

      cy.get(`[data-cy="hours"]`).type('51462').should('have.value', '51462');

      cy.get(`[data-cy="minutes"]`).type('50371').should('have.value', '50371');

      cy.get(`[data-cy="seconds"]`).type('98847').should('have.value', '98847');

      cy.get(`[data-cy="empty"]`).type('e-business').should('have.value', 'e-business');

      cy.get(`[data-cy="idk"]`).type('connecting withdrawal').should('have.value', 'connecting withdrawal');

      cy.get(`[data-cy="idk1"]`).type('Trail copy').should('have.value', 'Trail copy');

      cy.get(`[data-cy="dueDate"]`).type('2023-04-17T16:56').blur().should('have.value', '2023-04-17T16:56');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        antiprocrastinationListTwo = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', antiprocrastinationListTwoPageUrlPattern);
    });
  });
});
