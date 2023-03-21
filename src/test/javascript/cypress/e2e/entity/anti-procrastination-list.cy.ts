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

describe('AntiProcrastinationList e2e test', () => {
  const antiProcrastinationListPageUrl = '/anti-procrastination-list';
  const antiProcrastinationListPageUrlPattern = new RegExp('/anti-procrastination-list(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const antiProcrastinationListSample = {};

  let antiProcrastinationList;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/anti-procrastination-lists+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/anti-procrastination-lists').as('postEntityRequest');
    cy.intercept('DELETE', '/api/anti-procrastination-lists/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (antiProcrastinationList) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/anti-procrastination-lists/${antiProcrastinationList.id}`,
      }).then(() => {
        antiProcrastinationList = undefined;
      });
    }
  });

  it('AntiProcrastinationLists menu should load AntiProcrastinationLists page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('anti-procrastination-list');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AntiProcrastinationList').should('exist');
    cy.url().should('match', antiProcrastinationListPageUrlPattern);
  });

  describe('AntiProcrastinationList page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(antiProcrastinationListPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AntiProcrastinationList page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/anti-procrastination-list/new$'));
        cy.getEntityCreateUpdateHeading('AntiProcrastinationList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationListPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/anti-procrastination-lists',
          body: antiProcrastinationListSample,
        }).then(({ body }) => {
          antiProcrastinationList = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/anti-procrastination-lists+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [antiProcrastinationList],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(antiProcrastinationListPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AntiProcrastinationList page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('antiProcrastinationList');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationListPageUrlPattern);
      });

      it('edit button click should load edit AntiProcrastinationList page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AntiProcrastinationList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationListPageUrlPattern);
      });

      it('edit button click should load edit AntiProcrastinationList page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AntiProcrastinationList');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationListPageUrlPattern);
      });

      it('last delete button click should delete instance of AntiProcrastinationList', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('antiProcrastinationList').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationListPageUrlPattern);

        antiProcrastinationList = undefined;
      });
    });
  });

  describe('new AntiProcrastinationList page', () => {
    beforeEach(() => {
      cy.visit(`${antiProcrastinationListPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AntiProcrastinationList');
    });

    it('should create an instance of AntiProcrastinationList', () => {
      cy.get(`[data-cy="link"]`).type('solutions El synergistic').should('have.value', 'solutions El synergistic');

      cy.get(`[data-cy="type"]`).type('Tuna').should('have.value', 'Tuna');

      cy.get(`[data-cy="days"]`).type('45542').should('have.value', '45542');

      cy.get(`[data-cy="hours"]`).type('34764').should('have.value', '34764');

      cy.get(`[data-cy="minutes"]`).type('52016').should('have.value', '52016');

      cy.get(`[data-cy="seconds"]`).type('83105').should('have.value', '83105');

      cy.get(`[data-cy="empty"]`).type('Bedfordshire').should('have.value', 'Bedfordshire');

      cy.get(`[data-cy="idk"]`).type('foreground Versatile Consultant').should('have.value', 'foreground Versatile Consultant');

      cy.get(`[data-cy="idk1"]`).type('Keyboard').should('have.value', 'Keyboard');

      cy.get(`[data-cy="dueDate"]`).type('2023-03-19T06:32').blur().should('have.value', '2023-03-19T06:32');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        antiProcrastinationList = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', antiProcrastinationListPageUrlPattern);
    });
  });
});
